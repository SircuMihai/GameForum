export async function apiRequest(path, { token, headers, ...options } = {}) {
  const finalHeaders = {
    ...(headers || {}),
  }

  if (!(options?.body instanceof FormData)) {
    if (!finalHeaders['Content-Type'] && options?.body != null) {
      finalHeaders['Content-Type'] = 'application/json'
    }
  }

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`
  }

  const resp = await fetch(path, {
    ...options,
    headers: finalHeaders,
  })

  const contentType = resp.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  const data = isJson ? await resp.json().catch(() => null) : await resp.text().catch(() => null)

  if (!resp.ok) {
    const message =
      (data && typeof data === 'object' && data.message) ||
      (typeof data === 'string' && data) ||
      `Request failed: ${resp.status}`

    throw new Error(message)
  }

  return data
}
