import { useContext, useEffect, useMemo, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { UserBadge } from '../components/threadView/UserBadge'
import { apiRequest } from '../api'
import { AuthContext } from '../auth/AuthContext'

import { motion as Motion, AnimatePresence } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'
import { X, Check, Sparkles, Upload } from 'lucide-react'

import woodTexture from '../assets/Backgrounds/wood-texture.png'

export default function UserProfile() {
  const { id } = useParams()
  const auth = useContext(AuthContext)

  const userId = useMemo(() => {
    const n = Number(id)
    return Number.isFinite(n) ? n : null
  }, [id])

  const isOwnProfile =
    userId != null && auth?.user?.userId != null && Number(auth.user.userId) === Number(userId)

  const role = String(auth?.user?.role || auth?.user?.userRole || '').toUpperCase()
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN'

  const [profile, setProfile] = useState(null)
  const [titles, setTitles] = useState([])
  const [allAchievements, setAllAchievements] = useState([])
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [loading, setLoading] = useState(false)
  const [savingTitle, setSavingTitle] = useState(false)
  const [savingQuoto, setSavingQuoto] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [quotoDraft, setQuotoDraft] = useState('')
  const [error, setError] = useState('')

  const [editModalOpen, setEditModalOpen] = useState(false)
  const fileInputRef = useRef(null)

  const onDeleteUser = async () => {
    if (!isAdmin || userId == null || isOwnProfile) return

    const ok = window.confirm('Ștergi utilizatorul?')
    if (!ok) return

    try {
      await apiRequest(`/api/user/${userId}`, { method: 'DELETE', token: auth?.token })
      setProfile(null)
      setTitles([])
      setAllAchievements([])
      setUnlockedAchievements([])
      setError('User deleted')
    } catch (err) {
      setError(err?.message || 'Failed to delete user')
    }
  }

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })

  const onPickAvatar = async (e) => {
    if (!isOwnProfile || !auth?.token || userId == null) return
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (savingAvatar) return

    try {
      setSavingAvatar(true)
      setError('')
      const dataUrl = await fileToDataUrl(file)
      const updated = await apiRequest(`/api/user/${userId}/avatar`, {
        method: 'PUT',
        token: auth.token,
        body: JSON.stringify({ avatar: dataUrl }),
      })
      setProfile(updated)
    } catch (err) {
      setError(err?.message || 'Failed to update avatar')
    } finally {
      setSavingAvatar(false)
    }
  }

  const normalizeAchievementPhotoSrc = (value) => {
    if (!value) return ''

    const v = String(value).trim()
    if (!v) return ''

    if (v.startsWith('/')) return v

    const m = v.toLowerCase().match(/^achievments_([a-z0-9_]+)_png$/)
    if (m && m[1]) return `/Achievments/${m[1]}.png`

    if (v.toLowerCase().startsWith('achievments/')) return '/' + v

    return v
  }

  const formatAchievementText = (value) => {
    if (!value) return ''
    const v = String(value).trim()
    if (!v) return ''
    return v.replace(/_/g, ' ')
  }

  useEffect(() => {
    if (userId == null) return

    let canceled = false
    ;(async () => {
      try {
        setLoading(true)
        setError('')

        const [u, unlockedTitles, allAch, unlockedAch] = await Promise.all([
          apiRequest(`/api/user/${userId}`),
          apiRequest(`/api/user/${userId}/titles`),
          apiRequest('/api/achievement'),
          apiRequest(`/api/user/${userId}/achievements`),
        ])

        if (canceled) return
        setProfile(u)
        setQuotoDraft(u?.quoto || '')
        setTitles(Array.isArray(unlockedTitles) ? unlockedTitles : [])
        setAllAchievements(Array.isArray(allAch) ? allAch : [])
        setUnlockedAchievements(Array.isArray(unlockedAch) ? unlockedAch : [])
      } catch (e) {
        if (!canceled) {
          setProfile(null)
          setTitles([])
          setAllAchievements([])
          setUnlockedAchievements([])
          setError(e?.message || 'Failed to load user profile')
        }
      } finally {
        if (!canceled) setLoading(false)
      }
    })()

    return () => {
      canceled = true
    }
  }, [userId])

  const selectedTitleValue =
    profile?.selectedTitleAchievementId != null ? String(profile.selectedTitleAchievementId) : ''

  const onChangeTitle = async (e) => {
    const value = e.target.value
    const achievementId = value ? Number(value) : null

    if (!isOwnProfile) return
    if (!auth?.token) {
      setError('You must be logged in to change your title')
      return
    }

    setSavingTitle(true)
    setError('')
    try {
      const updated = await apiRequest(`/api/user/${userId}/title`, {
        method: 'PUT',
        token: auth.token,
        body: JSON.stringify({ achievementId }),
      })
      setProfile(updated)
    } catch (err) {
      setError(err?.message || 'Failed to update title')
    } finally {
      setSavingTitle(false)
    }
  }

  const onSaveQuoto = async () => {
    if (!isOwnProfile) return
    if (!auth?.token) {
      setError('You must be logged in to change your quoto')
      return
    }
    if (savingQuoto) return

    try {
      setSavingQuoto(true)
      setError('')
      const updated = await apiRequest(`/api/user/${userId}/quoto`, {
        method: 'PUT',
        token: auth.token,
        body: JSON.stringify({ quoto: quotoDraft }),
      })
      setProfile(updated)
      setQuotoDraft(updated?.quoto || '')
      setEditModalOpen(false)
    } catch (err) {
      setError(err?.message || 'Failed to update quoto')
    } finally {
      setSavingQuoto(false)
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-lg border-2 border-amber-700/60 shadow-2xl">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${woodTexture})`,
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto',
              backgroundPosition: 'top left',
            }}
          />
          <div className="absolute inset-0 pointer-events-none bg-black/35" />

          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-amber-500 z-10" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-amber-500 z-10" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-amber-500 z-10" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-amber-500 z-10" />

          <div className="relative z-10 p-8 text-parchment-300">
            <h2
              className="text-2xl font-bold text-amber-300 mb-6 text-center uppercase tracking-wider"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              User Profile
            </h2>

            {loading ? (
              <div className="text-parchment-300 font-serif">Loading...</div>
            ) : profile == null ? (
              <div className="text-parchment-300 font-serif">{error || 'User not found'}</div>
            ) : (
              <div className="space-y-8">
                {error ? (
                  <div className="rounded border border-red-700/40 bg-red-900/20 px-3 py-2 text-sm text-parchment-300">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <UserBadge
                    username={profile.nickname}
                    role={String(profile.role || '').toLowerCase()}
                    avatarUrl={profile.avatar}
                  />

                  <div className="grow">
                    <div className="text-parchment-300 font-display font-bold text-2xl tracking-wide">
                      {profile.nickname}
                    </div>
                    <div className="text-parchment-300 text-xs uppercase tracking-widest font-bold mt-1">
                      {profile.role}
                    </div>


                    {isOwnProfile ? (
                      <div className="mt-4">
                        <div className="text-xs text-parchment-300 uppercase tracking-widest font-bold mb-2">
                          Avatar
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={onPickAvatar}
                          disabled={savingAvatar}
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={savingAvatar}
                          className="flex items-center gap-2 px-4 py-2 rounded-sm border border-wood-600 bg-wood-800 text-parchment-300 font-display font-bold text-xs uppercase tracking-widest hover:border-gold-500 hover:bg-wood-700 transition disabled:opacity-60"
                        >
                          <Upload size={14} />
                          {savingAvatar ? 'Saving...' : 'Change avatar'}
                        </button>
                      </div>
                    ) : null}

                    {isAdmin && !isOwnProfile ? (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={onDeleteUser}
                          className="px-4 py-2 rounded-sm border border-red-600 bg-red-900/20 text-parchment-300 font-display font-bold text-sm hover:bg-red-900/30 transition"
                        >
                          Delete user
                        </button>
                      </div>
                    ) : null}

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-wood-900/60 border border-wood-700 rounded-sm p-4 text-parchment-300">
                        <div className="text-xs text-parchment-300 uppercase tracking-widest font-bold mb-1">
                          Email
                        </div>
                        <div className="text-parchment-300 font-serif break-all">
                          {profile.userEmail || '-'}
                        </div>
                      </div>

                      <div className="bg-wood-900/60 border border-wood-700 rounded-sm p-4 text-parchment-300">
                        <div className="text-xs text-parchment-300 uppercase tracking-widest font-bold mb-1">
                          Title
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            className="bg-wood-800 text-parchment-300 border border-wood-600 rounded-sm px-3 py-2 w-full"
                            value={selectedTitleValue}
                            onChange={onChangeTitle}
                            disabled={!isOwnProfile || savingTitle}
                          >
                            <option value="">No title</option>
                            {titles.map((t) => (
                              <option key={t.achievementId} value={String(t.achievementId)}>
                                {t.titleName}
                              </option>
                            ))}
                          </select>

                          {savingTitle ? (
                            <span className="text-xs text-parchment-300 uppercase tracking-widest font-bold">
                              Saving...
                            </span>
                          ) : null}
                        </div>

                        {!isOwnProfile ? (
                          <div className="text-xs text-parchment-300 mt-2 font-serif italic">
                            Only the owner can change the title.
                          </div>
                        ) : null}
                      </div>

                      <div className="bg-wood-900/60 border border-wood-700 rounded-sm p-4 md:col-span-2 text-parchment-300">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="text-xs text-parchment-300 uppercase tracking-widest font-bold">
                            Quoto
                          </div>

                          {isOwnProfile ? (
                            <Motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setEditModalOpen(true)}
                              className="flex items-center gap-2 px-4 py-2 bg-wood-800 border border-wood-600 text-parchment-300 rounded-sm text-xs font-display font-bold uppercase tracking-widest hover:border-gold-500 hover:bg-wood-700 transition-all"
                            >
                              <Sparkles size={14} />
                              Edit
                            </Motion.button>
                          ) : null}
                        </div>

                        <div className="border-l-[3px] border-gold-600 pl-4">
                          <div className="text-parchment-300 font-serif italic warp-break-word leading-relaxed">
                            "{profile.quoto || ''}"
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gold-400 mb-2 flex items-center justify-center gap-3">
                      <span className="text-gold-500">⚜</span>
                      Honors of Service
                      <span className="text-gold-500">⚜</span>
                    </h2>
                    <p className="text-parchment-300 font-serif italic">
                      Hover pe medalie ca să vezi detalii.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {allAchievements.map((a, index) => {
                      const unlocked = unlockedAchievements.some(
                        (u) => Number(u.achievementId) === Number(a.achievementId)
                      )
                      const src = normalizeAchievementPhotoSrc(a.achievementPhoto)
                      const title = formatAchievementText(a.achievementName)
                      const description = formatAchievementText(
                        a.achievementDescription || a.achievementName
                      )

                      return (
                        <AchievementMedal
                          key={a.achievementId}
                          title={title}
                          description={description}
                          requirement={formatAchievementText(a.requirement || '')}
                          xp={typeof a.xp === 'number' ? a.xp : undefined}
                          src={src}
                          earned={unlocked}
                          index={index}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editModalOpen && (
          <>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setQuotoDraft(profile?.quoto || '')
                setEditModalOpen(false)
              }}
              className="fixed inset-0 bg-black/70 z-100"
            />

            <Motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-wood-900 border-2 border-gold-700 rounded-sm shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden text-parchment-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-wood-800 border-b border-gold-700 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center">
                      <Sparkles size={16} className="text-wood-900" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-parchment-300">Edit Quoto</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setQuotoDraft(profile?.quoto || '')
                      setEditModalOpen(false)
                    }}
                    className="p-2 text-parchment-300 hover:text-parchment-300/90 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-3">
                  <label className="block text-sm font-display font-bold text-parchment-300 uppercase tracking-wider">
                    Quoto
                  </label>
                  <textarea
                    value={quotoDraft}
                    onChange={(e) => setQuotoDraft(e.target.value)}
                    rows={5}
                    className="w-full bg-parchment-200 border-2 border-wood-600 text-wood-900 px-4 py-3 rounded-sm font-serif text-base placeholder:text-wood-400 placeholder:italic focus:border-gold-500 focus:outline-none transition-colors shadow-inner resize-none"
                    placeholder="Write your quoto..."
                    disabled={savingQuoto}
                  />
                  <p className="text-xs text-parchment-300 font-serif italic">
                    This quote appears on your profile and next to your posts.
                  </p>
                </div>

                <div className="px-6 py-4 border-t border-wood-700 flex gap-3 bg-wood-800/50">
                  <button
                    type="button"
                    onClick={() => onSaveQuoto()}
                    disabled={savingQuoto}
                    className="flex-1 flex items-center justify-center gap-2 bg-gold-600 text-wood-900 px-6 py-3 rounded-sm font-bold font-display border border-gold-400 hover:bg-gold-500 transition-all disabled:opacity-60"
                  >
                    <Check size={18} />
                    {savingQuoto ? 'Saving...' : 'Save'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setQuotoDraft(profile?.quoto || '')
                      setEditModalOpen(false)
                    }}
                    className="flex items-center justify-center gap-2 bg-wood-800 text-parchment-300 px-6 py-3 rounded-sm font-bold font-display border border-wood-600 hover:border-parchment-400 hover:text-parchment-300 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function AchievementMedal({ title, description, requirement, xp, src, earned, index }) {
  const safeSrc = src || ''

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger asChild>
          <Motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className={`flex flex-col items-center gap-4 cursor-help ${
              !earned ? 'opacity-35 grayscale' : ''
            }`}
          >
            <div className="relative">
              {earned ? <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl scale-125" /> : null}

              <div
                className={`relative w-30 h-30 rounded-full border-4 flex items-center justify-center ${
                  earned
                    ? 'border-gold-500 bg-linear-to-b from-gold-600/30 to-wood-800 shadow-glow-gold'
                    : 'border-wood-600 bg-wood-800'
                }`}
              >
                <div
                  className={`w-22 h-22 rounded-full flex items-center justify-center border overflow-hidden ${
                    earned
                      ? 'bg-linear-to-b from-gold-500/40 to-bronze-500/30 border-gold-600'
                      : 'bg-wood-900 border-wood-700'
                  }`}
                >
                  {safeSrc ? (
                    <img src={safeSrc} alt={title} className="w-full h-full object-cover" draggable="false" />
                  ) : (
                    <div className="w-full h-full rounded bg-wood-800 border border-wood-700" />
                  )}
                </div>
              </div>
            </div>

            <span
              className={`text-sm font-display font-bold text-center leading-tight max-w-32.5 ${
                earned ? 'text-parchment-300' : 'text-parchment-300/50'
              }`}
            >
              {title}
            </span>
          </Motion.div>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 px-4 py-3 text-sm bg-wood-900 border-2 border-gold-600 shadow-2xl rounded-sm max-w-xs text-parchment-300"
            sideOffset={8}
          >
            <p className="font-display font-bold text-gold-400 mb-1 text-base">
              {String(title || '').toUpperCase()}
            </p>

            <p className="text-parchment-300 font-serif italic">{description}</p>

            {(requirement || typeof xp === 'number') && (
              <div className="mt-3 border-t border-wood-700 pt-2 space-y-1">
                {requirement ? (
                  <p className="text-gold-300 font-display font-bold text-xs uppercase tracking-widest">
                    Requirement:
                    <span className="ml-2 text-parchment-300 font-serif font-normal normal-case tracking-normal">
                      {requirement}
                    </span>
                  </p>
                ) : null}

                {typeof xp === 'number' ? (
                  <p className="text-wood-300 font-display font-bold text-xs uppercase tracking-widest">
                    XP:
                    <span className="ml-2 text-parchment-300 font-serif font-normal normal-case tracking-normal">
                      {xp}
                    </span>
                  </p>
                ) : null}
              </div>
            )}

            {!earned ? <p className="text-parchment-300/60 font-serif text-xs mt-2">🔒 Not yet earned</p> : null}

            <Tooltip.Arrow className="fill-wood-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
