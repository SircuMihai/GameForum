import React, { useEffect, useState } from 'react'
import { Volume2, User, Check } from 'lucide-react'

export default function OptionsPage() {
  const [settings, setSettings] = useState({
    music: true,
  })

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
            <ActionButton label="Change Password" />
            <ActionButton label="Delete Account" danger />
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

function ActionButton({ label, danger = false }) {
  return (
    <button
      className={`w-full px-6 py-3 rounded-sm font-display font-bold border-2 transition-all
        ${
          danger
            ? 'bg-red-900/20 border-red-700 text-red-400 hover:bg-red-900/40 hover:border-red-600'
            : 'bg-wood-800 border-wood-600 text-parchment-300 hover:border-gold-500 hover:text-gold-400'
        }`}
    >
      {label}
    </button>
  )
}
