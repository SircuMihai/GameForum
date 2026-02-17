const { spawn } = require('child_process')
const fs = require('fs')
const net = require('net')
const path = require('path')

const forumDir = __dirname
const composePath = path.join(forumDir, 'compose.yaml')
const frontendDir = path.join(forumDir, 'src', 'frontend', 'GameForum-master')
const args = new Set(process.argv.slice(2))

const dbServiceName = 'ForumDataBase'
const dbName = 'ForumDataBase'
const dbUser = 'admin'

function runShell(commandLine, { cwd } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(commandLine, {
      cwd,
      shell: true,
      stdio: 'inherit',
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Command failed (${code}): ${commandLine}`))
    })
  })
}

async function ensureJavacAvailable() {
  try {
    await runShell('javac -version')
  } catch {
    const baseMsg =
      'Java compiler (javac) not found. Install a Java 17 JDK (not just a JRE) and set JAVA_HOME + PATH to the JDK bin folder.'

    if (process.platform !== 'win32' || !args.has('--install-jdk')) {
      throw new Error(`${baseMsg} (Tip: re-run with --install-jdk to try installing automatically via winget on Windows.)`)
    }

    try {
      await runShell('winget --version')
    } catch {
      throw new Error(
        `${baseMsg} Automatic install requested, but winget is not available. Install Java 17 JDK manually or install winget (App Installer) and try again.`
      )
    }

    console.log('javac not found. Attempting to install Java 17 JDK via winget...')
    try {
      await runShell('winget install -e --id EclipseAdoptium.Temurin.17.JDK --accept-source-agreements --accept-package-agreements')
    } catch {
      throw new Error(
        `${baseMsg} Winget install failed. Try running the terminal as Administrator and re-run: node forum\\start-dev.js --install-jdk`
      )
    }

    console.log('Re-checking javac... (you may need to open a NEW terminal after installation)')
    try {
      await runShell('javac -version')
    } catch {
      throw new Error(
        `${baseMsg} Java 17 JDK was installed but javac is still not visible in this terminal. Close this terminal, open a new one, then re-run the script.`
      )
    }
  }
}

async function dockerComposeUp(composeFile, { cwd } = {}) {
  const quoted = `-f "${composeFile}"`
  try {
    await runShell(`docker compose ${quoted} up -d`, { cwd })
  } catch (e) {
    await runShell(`docker-compose ${quoted} up -d`, { cwd })
  }
}

function getImportSqlFiles(importDir) {
  try {
    if (!fs.existsSync(importDir)) return []
    return fs
      .readdirSync(importDir, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.sql'))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b))
  } catch {
    return []
  }
}

async function importSqlSeedData() {
  const importDir = path.join(forumDir, 'import')
  const files = getImportSqlFiles(importDir)
  if (files.length === 0) {
    console.log('No SQL seed files found in forum/import. Skipping import.')
    return
  }

  console.log(`Importing seed data from forum/import (${files.length} file(s))...`)
  for (const fileName of files) {
    const containerPath = `/docker-entrypoint-initdb.d/${fileName}`
    const cmd = `docker compose -f "${composePath}" exec -T ${dbServiceName} psql -U ${dbUser} -d ${dbName} -f ${containerPath}`
    try {
      console.log(`- Importing ${fileName}...`)
      await runShell(cmd, { cwd: forumDir })
    } catch (e) {
      console.warn(`- Failed to import ${fileName} (continuing).`)
    }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function waitForPort({ host, port, timeoutMs, intervalMs }) {
  const started = Date.now()

  while (Date.now() - started < timeoutMs) {
    const ok = await new Promise((resolve) => {
      const socket = net.connect({ host, port })
      socket.once('connect', () => {
        socket.end()
        resolve(true)
      })
      socket.once('error', () => resolve(false))
      socket.setTimeout(1500, () => {
        socket.destroy()
        resolve(false)
      })
    })

    if (ok) return
    await sleep(intervalMs)
  }

  throw new Error(`Timeout waiting for ${host}:${port}`)
}

function startLongRunning(name, commandLine, { cwd } = {}) {
  const child = spawn(commandLine, {
    cwd,
    shell: true,
    stdio: 'inherit',
  })

  child.on('exit', (code) => {
    const normalized = typeof code === 'number' ? code : 0
    console.error(`${name} exited with code ${normalized}`)
    process.exit(normalized)
  })

  child.on('error', (err) => {
    console.error(`${name} failed to start:`, err)
    process.exit(1)
  })

  return child
}

function killProcessTree(pid) {
  if (!pid) return

  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore', shell: true })
    return
  }

  try {
    process.kill(pid, 'SIGTERM')
  } catch {}
}

async function main() {
  if (!fs.existsSync(composePath)) {
    throw new Error(`compose.yaml not found at: ${composePath}`)
  }

  console.log('Starting database (Docker Compose)...')
  try {
    await dockerComposeUp(composePath, { cwd: forumDir })
  } catch (e) {
    throw new Error('Failed to start database. Ensure Docker is running and Docker Compose is installed.')
  }

  console.log('Waiting for database on localhost:6000...')
  await waitForPort({ host: '127.0.0.1', port: 6000, timeoutMs: 120_000, intervalMs: 1000 })

  console.log('Checking Java (javac)...')
  await ensureJavacAvailable()

  console.log('Starting backend (Spring Boot)...')
  const backendCmd = process.platform === 'win32' ? 'mvnw.cmd spring-boot:run' : './mvnw spring-boot:run'
  const backend = startLongRunning('backend', backendCmd, { cwd: forumDir })

  console.log('Waiting for backend on localhost:8080...')
  await waitForPort({ host: '127.0.0.1', port: 8080, timeoutMs: 180_000, intervalMs: 1000 })

  await importSqlSeedData()

  if (!fs.existsSync(frontendDir)) {
    throw new Error(`Frontend folder not found at: ${frontendDir}`)
  }

  const nodeModulesPath = path.join(frontendDir, 'node_modules')
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('Installing frontend dependencies (npm install)...')
    await runShell('npm install', { cwd: frontendDir })
  }

  console.log('Starting frontend (Vite dev server)...')
  const frontend = startLongRunning('frontend', 'npm run dev', { cwd: frontendDir })

  const shutdown = () => {
    killProcessTree(frontend.pid)
    killProcessTree(backend.pid)
  }

  process.on('SIGINT', () => {
    shutdown()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    shutdown()
    process.exit(0)
  })
}

main().catch((err) => {
  console.error(err?.message || err)
  process.exit(1)
})
