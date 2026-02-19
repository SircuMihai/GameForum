import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../api'
import { useAuth } from '../auth/useAuth'
import { AnimatePresence } from 'framer-motion'
import {
  X,
  Trash2,
  Crown,
  Shield,
  Check,
  Users,
  Search,
  Ban,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  ArrowUpDown,
  UserCog,
  Mail,
  MessageSquare,
  ThumbsUp,
  Calendar,
  Activity,
} from 'lucide-react'

const ROLE_COLORS = {
  admin: {
    bg: 'bg-gold-600/20',
    text: 'text-gold-400',
    border: 'border-gold-600',
  },
  moderator: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-400',
    border: 'border-blue-600',
  },
  user: {
    bg: 'bg-wood-800',
    text: 'text-parchment-400',
    border: 'border-wood-600',
  },
}

export default function AdminPage() {
  const auth = useAuth()
  const [userList, setUserList] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortField, setSortField] = useState('username')
  const [sortAsc, setSortAsc] = useState(true)

  const [deleteUserConfirm, setDeleteUserConfirm] = useState(null)
  const [roleChangeUser, setRoleChangeUser] = useState(null)
  const [roleMenuPlacement, setRoleMenuPlacement] = useState({})
  const [userDetailId, setUserDetailId] = useState(null)
  const [selectedUsers, setSelectedUsers] = useState(new Set())

  useEffect(() => {
    let canceled = false

    ;(async () => {
      try {
        setLoadingUsers(true)
        setUsersError('')

        const data = await apiRequest('/api/user', { token: auth?.token })
        const list = Array.isArray(data) ? data : []

        const mapped = list.map((u) => {
          const role = String(u?.role || 'USER').toLowerCase()
          const banned = Boolean(u?.banned)
          return {
            id: u?.userId,
            username: u?.nickname || u?.username || 'Unknown',
            email: u?.userEmail || u?.email || '',
            role,
            status: banned ? 'banned' : 'active',
            joinDate: u?.createdAt || '',
            postCount: 0,
            likes: 0,
            bio: u?.quoto || '',
          }
        })

        if (!canceled) setUserList(mapped)
      } catch (e) {
        if (!canceled) {
          setUsersError(e?.message || 'Failed to load users')
          setUserList([])
        }
      } finally {
        if (!canceled) setLoadingUsers(false)
      }
    })()

    return () => {
      canceled = true
    }
  }, [auth?.token])

  const filteredUsers = useMemo(() => {
    let result = [...userList]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      )
    }

    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter)
    }

    result.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'username':
          cmp = a.username.localeCompare(b.username)
          break
        case 'postCount':
          cmp = a.postCount - b.postCount
          break
        case 'joinDate':
          cmp = a.joinDate.localeCompare(b.joinDate)
          break
        default:
          cmp = 0
      }
      return sortAsc ? cmp : -cmp
    })

    return result
  }, [userList, searchQuery, roleFilter, sortField, sortAsc])

  const detailUser = userDetailId
    ? userList.find((u) => u.id === userDetailId)
    : null

  const handleDeleteUser = async (id) => {
    try {
      await apiRequest(`/api/user/${id}`, {
        method: 'DELETE',
        token: auth?.token,
      })
      setUserList((prev) => prev.filter((u) => u.id !== id))
    } finally {
      setDeleteUserConfirm(null)
      setSelectedUsers((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleToggleBan = async (id) => {
    const current = userList.find((u) => u.id === id)
    if (!current) return

    const shouldBan = current.status !== 'banned'
    const endpoint = shouldBan ? `/api/user/${id}/ban` : `/api/user/${id}/unban`

    try {
      const updated = await apiRequest(endpoint, {
        method: 'PUT',
        token: auth?.token,
      })

      setUserList((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                status: updated?.banned ? 'banned' : 'active',
              }
            : u,
        ),
      )
    } catch (e) {
      alert(e?.message || 'Nu am putut actualiza ban-ul utilizatorului.')
    }
  }

  const handleChangeRole = async (id, newRole) => {
    const normalized = String(newRole || '').toUpperCase()
    try {
      await apiRequest(`/api/user/${id}/role`, {
        method: 'PUT',
        token: auth?.token,
        body: JSON.stringify({ role: normalized }),
      })
      setUserList((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, role: String(newRole || '').toLowerCase() } : u,
        ),
      )
    } finally {
      setRoleChangeUser(null)
    }
  }

  const handleToggleRoleMenu = (userId, clickTarget) => {
    setRoleChangeUser((prev) => {
      const next = prev === userId ? null : userId
      if (next && clickTarget && typeof window !== 'undefined') {
        const rect = clickTarget.getBoundingClientRect()
        const menuHeight = 140
        const spaceBelow = window.innerHeight - rect.bottom
        const openUp = spaceBelow < menuHeight && rect.top > menuHeight
        setRoleMenuPlacement((p) => ({
          ...p,
          [userId]: openUp ? 'up' : 'down',
        }))
      }
      return next
    })
  }

  const handleSort = (field) => {
    if (sortField === field) setSortAsc((s) => !s)
    else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    setSelectedUsers((prev) => {
      if (prev.size === filteredUsers.length) return new Set()
      return new Set(filteredUsers.map((u) => u.id))
    })
  }

  const handleBulkBan = async () => {
    const ids = Array.from(selectedUsers)
    if (ids.length === 0) return

    try {
      await Promise.all(
        ids.map((id) =>
          apiRequest(`/api/user/${id}/ban`, {
            method: 'PUT',
            token: auth?.token,
          }),
        ),
      )

      setUserList((prev) =>
        prev.map((u) => (selectedUsers.has(u.id) ? { ...u, status: 'banned' } : u)),
      )
      setSelectedUsers(new Set())
    } catch (e) {
      alert(e?.message || 'Nu am putut bana utilizatorii selectați.')
    }
  }

  const handleBulkDelete = () => {
    setUserList((prev) => prev.filter((u) => !selectedUsers.has(u.id)))
    setSelectedUsers(new Set())
  }

  const totalUsers = userList.length
  const bannedUsers = userList.filter((u) => u.status === 'banned').length
  const admins = userList.filter((u) => u.role === 'admin').length
  const mods = userList.filter((u) => u.role === 'moderator').length

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gold-500" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold-600 bg-gold-600/10 px-3 py-1 border border-gold-700 rounded-sm">
              Administration
            </span>
          </div>

        {usersError && (
          <div className="mb-4 bg-red-900/20 border border-red-700 rounded-sm p-3 text-sm font-display font-bold text-red-400">
            {usersError}
          </div>
        )}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gold-400 text-shadow-black mb-3">
            Subject Registry
          </h1>
          <p className="text-parchment-300 font-serif text-lg">
            Manage the citizens of the realm — search, promote, discipline, or
            exile.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total', value: totalUsers, icon: <Users size={16} /> },
            {
              label: 'Banned',
              value: bannedUsers,
              icon: <Ban size={16} />,
              color: bannedUsers > 0 ? 'text-red-400' : undefined,
            },
            {
              label: 'Admins',
              value: admins,
              icon: <Crown size={16} />,
              color: 'text-gold-400',
            },
            {
              label: 'Mods',
              value: mods,
              icon: <Shield size={16} />,
              color: 'text-blue-400',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-wood-900/80 border border-wood-600 rounded-sm p-4 flex items-center gap-3"
            >
              <div className="text-wood-500">{stat.icon}</div>
              <div>
                <span
                  className={`block text-xl font-display font-bold ${
                    stat.color || 'text-parchment-100'
                  }`}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-wood-500 uppercase tracking-widest font-bold">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative grow">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-wood-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by nickname or email..."
              className="w-full bg-wood-800 border-2 border-wood-600 text-parchment-200 pl-12 pr-10 py-3 rounded-sm font-display text-sm placeholder:text-wood-500 placeholder:font-serif placeholder:italic focus:border-gold-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-500 hover:text-parchment-300 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 bg-wood-900/60 border border-wood-600 rounded-sm p-1">
            {['all', 'admin', 'moderator', 'user'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-2 rounded-sm text-xs font-display font-bold uppercase tracking-wider transition-all ${
                  roleFilter === role
                    ? 'bg-gold-600 text-wood-900 border border-gold-400'
                    : 'text-parchment-400 border border-transparent hover:text-gold-400'
                }`}
              >
                {role === 'all' ? 'All' : role}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedUsers.size > 0 && (
            <div className="mb-4 bg-gold-600/10 border border-gold-700 rounded-sm p-3 flex flex-wrap items-center justify-between gap-2 overflow-hidden">
              <span className="text-sm font-display font-bold text-gold-400">
                {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''}{' '}
                selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkBan}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-wood-800 border border-wood-600 rounded-sm text-xs font-display font-bold text-parchment-300 hover:border-gold-500 hover:text-gold-400 transition-colors"
                >
                  <Ban size={12} /> Ban Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 border border-red-700 rounded-sm text-xs font-display font-bold text-red-400 hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 size={12} /> Delete Selected
                </button>
                <button
                  onClick={() => setSelectedUsers(new Set())}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-wood-800 border border-wood-600 rounded-sm text-xs font-display font-bold text-parchment-400 hover:text-parchment-200 transition-colors"
                >
                  <X size={12} /> Clear
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>

        <div className="bg-wood-900/90 border-2 border-wood-600 rounded-sm">
          <div className="hidden md:grid grid-cols-10 gap-3 px-5 py-3 bg-wood-800 border-b border-gold-700 text-xs font-bold text-wood-400 uppercase tracking-widest items-center">
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={
                  selectedUsers.size === filteredUsers.length &&
                  filteredUsers.length > 0
                }
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-gold-500 cursor-pointer"
              />
            </div>

            <div className="col-span-3">
              <button
                onClick={() => handleSort('username')}
                className="flex items-center gap-1 text-parchment-300 hover:text-gold-400 transition-colors"
              >
                User {sortField === 'username' && <ArrowUpDown size={10} />}
              </button>
            </div>

            <div className="col-span-2 text-parchment-300">Role</div>

            <div className="col-span-1 text-center">
              <button
                onClick={() => handleSort('postCount')}
                className="flex items-center gap-1 text-parchment-300 hover:text-gold-400 transition-colors mx-auto"
              >
                Posts {sortField === 'postCount' && <ArrowUpDown size={10} />}
              </button>
            </div>

            <div className="col-span-3 text-parchment-300 text-right">Actions</div>
          </div>

          {loadingUsers ? (
            <div className="text-center py-16">
              <Activity size={32} className="mx-auto text-wood-600 mb-3" />
              <p className="text-parchment-400 font-serif italic">Loading users...</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredUsers.map((user) => {
              const roleStyle = ROLE_COLORS[user.role] || ROLE_COLORS.user
              const initial = user.username.charAt(0).toUpperCase()

              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-1 md:grid-cols-10 gap-3 px-5 py-3.5 border-b border-wood-700/50 items-center transition-colors ${
                    selectedUsers.has(user.id)
                      ? 'bg-gold-600/5'
                      : 'hover:bg-wood-800/40'
                  } ${user.status === 'banned' ? 'opacity-70' : ''}`}
                >
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="w-4 h-4 accent-gold-500 cursor-pointer"
                    />
                  </div>

                  <div className="col-span-3 flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-sm flex items-center justify-center border font-display font-bold text-sm shrink-0 ${
                        user.status === 'banned'
                          ? 'bg-red-900/30 border-red-700 text-red-400'
                          : `${roleStyle.bg} ${roleStyle.border} ${roleStyle.text}`
                      }`}
                    >
                      {initial}
                    </div>

                    <div className="min-w-0">
                      <button
                        onClick={() => setUserDetailId(user.id)}
                        className="font-display font-bold text-parchment-200 text-sm hover:text-gold-400 transition-colors truncate block"
                      >
                        {user.username}
                      </button>
                      <span className="text-xs text-wood-500 font-serif truncate block">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 relative">
                    <button
                      onClick={(e) => handleToggleRoleMenu(user.id, e.currentTarget)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-display font-bold uppercase tracking-wider border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border} hover:brightness-110 transition-all`}
                    >
                      {user.role === 'admin' ? (
                        <Crown size={10} />
                      ) : user.role === 'moderator' ? (
                        <Shield size={10} />
                      ) : (
                        <UserCog size={10} />
                      )}
                      {user.role}
                      <ChevronDown size={10} />
                    </button>

                    <AnimatePresence>
                      {roleChangeUser === user.id && (
                        <div
                          className={`absolute left-0 bg-wood-900 border-2 border-gold-600 rounded-sm shadow-2xl z-50 overflow-hidden w-40 ${
                            roleMenuPlacement[user.id] === 'up'
                              ? 'bottom-full mb-1'
                              : 'top-full mt-1'
                          }`}
                        >
                          {['user', 'moderator', 'admin'].map((r) => (
                            <button
                              key={r}
                              onClick={() => handleChangeRole(user.id, r)}
                              className={`w-full px-3 py-2 text-left text-xs font-display font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                                user.role === r
                                  ? 'bg-gold-600/20 text-gold-400'
                                  : 'text-parchment-400 hover:bg-wood-800 hover:text-parchment-200'
                              }`}
                            >
                              {r === 'admin' ? (
                                <Crown size={10} />
                              ) : r === 'moderator' ? (
                                <Shield size={10} />
                              ) : (
                                <UserCog size={10} />
                              )}
                              {r}
                              {user.role === r && (
                                <Check size={10} className="ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="col-span-1 text-center">
                    <span className="font-display font-bold text-parchment-300 text-sm">
                      {user.postCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-1.5">
                    <Link
                      to={`/user/${user.id}`}
                      className="p-2 bg-wood-800 border border-wood-600 rounded-sm text-parchment-400 hover:text-gold-400 hover:border-gold-500 transition-colors"
                      title="View profile"
                    >
                      <ExternalLink size={14} />
                    </Link>

                    <button
                      onClick={() => handleToggleBan(user.id)}
                      className={`p-2 border rounded-sm transition-colors ${
                        user.status === 'banned'
                          ? 'bg-green-900/20 border-green-700 text-green-400 hover:bg-green-900/40'
                          : 'bg-wood-800 border-wood-600 text-parchment-400 hover:text-orange-400 hover:border-orange-600'
                      }`}
                      title={user.status === 'banned' ? 'Unban user' : 'Ban user'}
                    >
                      {user.status === 'banned' ? (
                        <ShieldCheck size={14} />
                      ) : (
                        <Ban size={14} />
                      )}
                    </button>

                    {deleteUserConfirm === user.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-red-900/40 border border-red-600 rounded-sm text-red-400 hover:bg-red-900/60 transition-colors"
                          title="Confirm delete"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteUserConfirm(null)}
                          className="p-2 bg-wood-800 border border-wood-600 rounded-sm text-parchment-400 hover:text-parchment-200 transition-colors"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteUserConfirm(user.id)}
                        className="p-2 bg-wood-800 border border-wood-600 rounded-sm text-parchment-400 hover:text-red-400 hover:border-red-600 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )
              })}
            </AnimatePresence>
          )}

          {!loadingUsers && filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <Search size={32} className="mx-auto text-wood-600 mb-3" />
              <p className="text-parchment-400 font-serif italic">
                No subjects found matching your search.
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-gold-500 font-display font-bold text-sm hover:text-gold-400 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-wood-500 font-serif italic text-right">
          Showing {filteredUsers.length} of {userList.length} subjects
        </div>
      </div>

      <AnimatePresence>
        {detailUser && (
          <>
            <div
              onClick={() => setUserDetailId(null)}
              className="fixed inset-0 bg-black/70 z-100"
            />
            <div className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none">
              <div
                className="bg-wood-900 border-2 border-gold-700 rounded-sm shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-wood-800 border-b border-gold-700 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-display font-bold text-parchment-100">
                    User Details
                  </h2>
                  <button
                    onClick={() => setUserDetailId(null)}
                    className="p-2 text-wood-400 hover:text-parchment-200 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-sm flex items-center justify-center border-2 font-display font-bold text-2xl ${
                        ROLE_COLORS[detailUser.role].bg
                      } ${ROLE_COLORS[detailUser.role].border} ${
                        ROLE_COLORS[detailUser.role].text
                      }`}
                    >
                      {detailUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-parchment-100">
                        {detailUser.username}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-display font-bold uppercase border ${
                            ROLE_COLORS[detailUser.role].bg
                          } ${ROLE_COLORS[detailUser.role].text} ${
                            ROLE_COLORS[detailUser.role].border
                          }`}
                        >
                          {detailUser.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-[3px] border-gold-600 pl-4 mb-6 bg-wood-800/30 py-2 pr-3 rounded-r-sm">
                    <p className="text-parchment-300 font-serif italic">
                      "{detailUser.bio}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <DetailItem
                      icon={<Mail size={14} />}
                      label="Email"
                      value={detailUser.email}
                    />
                    <DetailItem
                      icon={<Calendar size={14} />}
                      label="Joined"
                      value={detailUser.joinDate}
                    />
                    <DetailItem
                      icon={<MessageSquare size={14} />}
                      label="Posts"
                      value={detailUser.postCount.toLocaleString()}
                    />
                    <DetailItem
                      icon={<ThumbsUp size={14} />}
                      label="Likes"
                      value={String(detailUser.likes)}
                    />
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-wood-700">
                    <Link
                      to={`/user/${detailUser.id}`}
                      onClick={() => setUserDetailId(null)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gold-600 text-wood-900 px-4 py-2.5 rounded-sm font-bold font-display text-sm border border-gold-400 hover:bg-gold-500 transition-colors"
                    >
                      <ExternalLink size={14} /> View Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleToggleBan(detailUser.id)
                        setUserDetailId(null)
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm font-bold font-display text-sm border transition-colors bg-wood-800 border-wood-600 text-parchment-300 hover:text-orange-400 hover:border-orange-600"
                    >
                      <Ban size={14} /> Toggle Ban
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="bg-wood-800/60 border border-wood-600 rounded-sm p-3">
      <div className="flex items-center gap-1.5 text-wood-400 mb-1">
        {icon}
        <span className="text-xs font-display font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-display font-bold text-parchment-200 break-all">
        {value}
      </span>
    </div>
  )
}