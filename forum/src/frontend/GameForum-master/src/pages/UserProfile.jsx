import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ForumLayout } from '../components/ForumLayout'
import FrameCard from '../components/FrameCard'
import { UserBadge } from '../components/UserBadge'
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
  const [loading, setLoading] = useState(false)
  const [savingTitle, setSavingTitle] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (userId == null) return

    let canceled = false
    ;(async () => {
      try {
        setLoading(true)
        setError('')

        const [u, unlocked] = await Promise.all([
          apiRequest(`/api/user/${userId}`),
          apiRequest(`/api/user/${userId}/titles`),
        ])

        if (canceled) return
        setProfile(u)
        setTitles(Array.isArray(unlocked) ? unlocked : [])
      } catch (e) {
        if (!canceled) {
          setProfile(null)
          setTitles([])
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </FrameCard>
      </div>
    </ForumLayout>
  )
}