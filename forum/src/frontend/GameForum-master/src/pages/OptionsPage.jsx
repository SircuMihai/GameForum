import React, { useEffect, useState } from 'react'
import { Volume2, User, Check } from 'lucide-react'
import { apiRequest } from '../api'

export default function OptionsPage() {
  const [settings, setSettings] = useState({
    music: true,
  })

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // load setari salvate
  useEffect(() => {
    const musicEnabled = localStorage.getItem('musicEnabled')

    setSettings((prev) => ({
      ...prev,
      music: musicEnabled === null ? prev.music : musicEnabled === 'true',
    }))
  }, [])

  const toggleMusic = () => {
    setSettings((prev) => ({
      ...prev,
      music: !prev.music,
    }))
  }

  const handleSave = () => {
    localStorage.setItem('musicEnabled', settings.music ? 'true' : 'false')

    // anunta layout-ul imediat (fara refresh)
    window.dispatchEvent(new Event('music-settings-changed'))
  }

  const handleChangePassword = async () => {
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword) {
      setError('Completeaza parola curenta si parola noua.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setError('Parola noua si confirmarea nu coincid.')
      return
    }

    try {
      setBusy(true)
      await apiRequest('/api/user/me/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      localStorage.removeItem('token')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('jwt')

      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setSuccess('Parola a fost schimbata. Te rugam sa te autentifici din nou.')

      setTimeout(() => {
        window.location.href = '/login'
      }, 800)
    } catch (e) {
      setError(e?.message || 'Eroare la schimbarea parolei.')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteAccount = async () => {
    setError('')
    setSuccess('')

    const ok = window.confirm('Sigur vrei sa stergi contul? Actiunea este ireversibila.')
    if (!ok) return

    try {
      setBusy(true)
      await apiRequest('/api/user/me', {
        method: 'DELETE',
      })

      localStorage.removeItem('token')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('jwt')

      setSuccess('Contul a fost sters.')
      setTimeout(() => {
        window.location.href = '/register'
      }, 800)
    } catch (e) {
      setError(e?.message || 'Eroare la stergerea contului.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gold-400 mb-4 text-shadow-black">
          Options & Settings
        </h1>
        <p className="text-xl text-parchment-200 font-serif">
          Configure your forum experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Audio Settings */}
        <SettingsPanel icon={<Volume2 className="w-6 h-6" />} title="Audio">
          <SettingToggle
            label="Background Music"
            description="Play ambient Age of Empires III music"
            checked={settings.music}
            onChange={toggleMusic}
          />
        </SettingsPanel>

        {/* Account Settings */}
        <SettingsPanel icon={<User className="w-6 h-6" />} title="Account">
          <div className="space-y-4">
            {error ? (
              <div className="bg-red-900/20 border-2 border-red-700 text-red-300 px-4 py-3 rounded-sm font-serif">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="bg-green-900/20 border-2 border-green-700 text-green-200 px-4 py-3 rounded-sm font-serif">
                {success}
              </div>
            ) : null}

            <div className="grid gap-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full bg-wood-800 border-2 border-wood-600 text-parchment-200 px-4 py-3 rounded-sm font-serif focus:outline-none focus:border-gold-500"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full bg-wood-800 border-2 border-wood-600 text-parchment-200 px-4 py-3 rounded-sm font-serif focus:outline-none focus:border-gold-500"
              />
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-wood-800 border-2 border-wood-600 text-parchment-200 px-4 py-3 rounded-sm font-serif focus:outline-none focus:border-gold-500"
              />
            </div>

            <ActionButton
              label={busy ? 'Working...' : 'Change Password'}
              onClick={handleChangePassword}
              disabled={busy}
            />
            <ActionButton
              label={busy ? 'Working...' : 'Delete Account'}
              danger
              onClick={handleDeleteAccount}
              disabled={busy}
            />
          </div>
        </SettingsPanel>
      </div>

      {/* Save Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={handleSave}
          className="flex items-center gap-3 bg-gold-600 text-wood-900 px-12 py-4 rounded-sm font-bold font-display text-lg shadow-glow-gold border-2 border-gold-400 hover:bg-gold-500 transition-all hover:scale-105"
        >
          <Check size={24} />
          Save Changes
        </button>
      </div>
    </div>
  )
}

function SettingsPanel({ icon, title, children }) {
  return (
    <div className="bg-wood-900/90 border-2 border-wood-600 rounded-sm overflow-hidden">
      <div className="bg-wood-800 border-b border-gold-700 px-6 py-4 flex items-center gap-3">
        <div className="text-gold-500">{icon}</div>
        <h2 className="text-2xl font-display font-bold text-parchment-100">{title}</h2>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </div>
  )
}

function SettingToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="grow">
        <h3 className="text-lg font-display font-bold text-parchment-200">{label}</h3>
        <p className="text-sm text-parchment-400 font-serif mt-1">{description}</p>
      </div>

      <button
        onClick={onChange}
        className={`relative w-16 h-8 rounded-full border-2 transition-all duration-300
        ${checked ? 'bg-gold-600 border-gold-400' : 'bg-wood-800 border-wood-600'}`}
      >
        <div
          className={`absolute top-1 w-5 h-5 rounded-full shadow-md
          ${checked ? 'bg-wood-900 right-1' : 'bg-wood-600 left-1'}`}
        />
      </button>
    </div>
  )
}

function ActionButton({ label, danger = false, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-6 py-3 rounded-sm font-display font-bold border-2 transition-all
        ${
          danger
            ? 'bg-red-900/20 border-red-700 text-red-400 hover:bg-red-900/40 hover:border-red-600'
            : 'bg-wood-800 border-wood-600 text-parchment-300 hover:border-gold-500 hover:text-gold-400'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  )
}
