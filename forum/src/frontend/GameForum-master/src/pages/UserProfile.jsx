import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ForumLayout } from '../components/layout/ForumLayout'
import FrameCard from '../components/auth/FrameCard'
import { UserBadge } from '../components/threadView/UserBadge'
import { apiRequest } from '../api'
import { AuthContext } from '../auth/AuthContext'

export default function UserProfile() {
  const { id } = useParams()
  const auth = useContext(AuthContext)

  const userId = useMemo(() => {
    const n = Number(id)
    return Number.isFinite(n) ? n : null
  }, [id])

  const isOwnProfile = userId != null && auth?.user?.userId != null && Number(auth.user.userId) === Number(userId)

  const role = String(auth?.user?.role || auth?.user?.userRole || '').toUpperCase()
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN'

  const onDeleteUser = async () => {
    if (!isAdmin || userId == null || isOwnProfile) return

    const ok = window.confirm('Ștergi utilizatorul?')
    if (!ok) return

    try {
      await apiRequest(`/api/user/${userId}`, { method: 'DELETE', token: auth?.token })
      setProfile(null)
      setTitles([])
      setError('User deleted')
    } catch (err) {
      setError(err?.message || 'Failed to delete user')
    }
  }

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

    // expected: /Achievments/first_battle.png
    if (v.startsWith('/')) return v

    // handle malformed values like: achievments_first_battle_png
    const m = v.toLowerCase().match(/^achievments_([a-z0-9_]+)_png$/)
    if (m && m[1]) return `/Achievments/${m[1]}.png`

    // handle relative values like: Achievments/first_battle.png
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

  const selectedTitleValue = profile?.selectedTitleAchievementId != null ? String(profile.selectedTitleAchievementId) : ''

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
    } catch (err) {
      setError(err?.message || 'Failed to update quoto')
    } finally {
      setSavingQuoto(false)
    }
  }

  return (
    <ForumLayout>
      <div className="max-w-5xl mx-auto">
        <FrameCard title="User Profile">
          {loading ? (
            <div className="text-parchment-300 font-serif">Loading...</div>
          ) : profile == null ? (
            <div className="text-parchment-300 font-serif">{error || 'User not found'}</div>
          ) : (
            <div className="space-y-8">
              {error ? (
                <div className="rounded border border-red-700/40 bg-red-900/20 px-3 py-2 text-sm text-red-200">
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
                  <div className="text-parchment-200 font-display font-bold text-2xl tracking-wide">
                    {profile.nickname}
                  </div>
                  <div className="text-wood-500 text-xs uppercase tracking-widest font-bold mt-1">
                    {profile.role}
                  </div>

                  {isOwnProfile ? (
                    <div className="mt-4">
                      <div className="text-xs text-wood-500 uppercase tracking-widest font-bold mb-2">Avatar</div>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onPickAvatar}
                          disabled={savingAvatar}
                          className="block w-full text-sm text-parchment-200 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border file:border-wood-600 file:bg-wood-800 file:text-parchment-200 hover:file:border-gold-500 disabled:opacity-60"
                        />
                        {savingAvatar ? (
                          <span className="text-xs text-wood-500 uppercase tracking-widest font-bold">Saving...</span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {isAdmin && !isOwnProfile ? (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={onDeleteUser}
                        className="px-4 py-2 rounded-sm border border-red-600 bg-red-900/20 text-red-200 font-display font-bold text-sm hover:bg-red-900/30 transition"
                      >
                        Delete user
                      </button>
                    </div>
                  ) : null}

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-wood-900/60 border border-wood-700 rounded-sm p-4">
                      <div className="text-xs text-wood-500 uppercase tracking-widest font-bold mb-1">Email</div>
                      <div className="text-parchment-200 font-serif break-all">{profile.userEmail || '-'}</div>
                    </div>

                    <div className="bg-wood-900/60 border border-wood-700 rounded-sm p-4">
                      <div className="text-xs text-wood-500 uppercase tracking-widest font-bold mb-1">Title</div>
                      <div className="flex items-center gap-3">
                        <select
                          className="bg-wood-800 text-parchment-200 border border-wood-600 rounded-sm px-3 py-2 w-full"
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
                          <span className="text-xs text-wood-500 uppercase tracking-widest font-bold">Saving...</span>
                        ) : null}
                      </div>
                      {!isOwnProfile ? (
                        <div className="text-xs text-wood-500 mt-2 font-serif italic">
                          Only the owner can change the title.
                        </div>
                      ) : null}
                    </div>

                    <div className="bg-wood-900/60 border border-wood-700 rounded-sm p-4 md:col-span-2">
                      <div className="text-xs text-wood-500 uppercase tracking-widest font-bold mb-1">Quoto</div>
                      {!isOwnProfile ? (
                        <div className="text-parchment-200 font-serif italic break-words">{profile.quoto || ''}</div>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            className="bg-wood-800 text-parchment-200 border border-wood-600 rounded-sm px-3 py-2 w-full min-h-24 font-serif"
                            value={quotoDraft}
                            onChange={(e) => setQuotoDraft(e.target.value)}
                            disabled={savingQuoto}
                            placeholder="Write your quoto..."
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={onSaveQuoto}
                              disabled={savingQuoto}
                              className="px-4 py-2 rounded-sm border border-gold-600 bg-gold-600/20 text-parchment-200 font-display font-bold text-sm hover:bg-gold-600/30 transition disabled:opacity-60"
                            >
                              {savingQuoto ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="achievements-container">
                <div className="text-xs text-wood-500 uppercase tracking-widest font-bold mb-4">Achievements</div>

                <div className="achievements-grid" id="achievements-grid">
                  {allAchievements.map((a) => {
                    const unlocked = unlockedAchievements.some((u) => Number(u.achievementId) === Number(a.achievementId))
                    const photoSrc = normalizeAchievementPhotoSrc(a.achievementPhoto)
                    const tooltipText = formatAchievementText(a.achievementDescription || a.achievementName)
                    const displayName = formatAchievementText(a.achievementName)

                    return (
                      <div
                        key={a.achievementId}
                        className={`achievement ${unlocked ? '' : 'locked'}`}
                      >
                        <div className="achievement-icon">
                          {photoSrc ? (
                            <img
                              src={photoSrc}
                              alt={a.achievementName}
                              draggable={false}
                            />
                          ) : null}
                          {unlocked ? <div className="achievement-ribbon" /> : null}
                        </div>
                        {tooltipText ? <div className="achievement-tooltip">{tooltipText}</div> : null}
                        <div className="achievement-name">{displayName}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </FrameCard>
      </div>
    </ForumLayout>
  )
}