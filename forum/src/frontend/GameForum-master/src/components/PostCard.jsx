import  { useEffect, useState } from 'react'
import { UserBadge } from './UserBadge'
import { Quote, Trash2, Edit3, Save, X } from 'lucide-react'

export function PostCard({ post, index, canManage, onDelete, onEdit }) {
  const author = {
    username: post?.userNickname || 'Unknown',
    role: post?.userRole || 'user',
    avatarUrl: post?.userAvatar,
    postCount: post?.userPostCount ?? 0,
    joinDate: post?.userJoinDate ?? '-',
    bio: post?.userBio ?? '',
  }

  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(post?.content || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(post?.content || '')
  }, [post?.content])

  const startEdit = () => {
    setDraft(post?.content || '')
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setDraft(post?.content || '')
    setIsEditing(false)
  }

  const saveEdit = async () => {
    const text = (draft || '').trim()
    if (!text) return
    if (saving) return

    try {
      setSaving(true)
      await onEdit?.(post.id, text)
      setIsEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-8"
    >
      <div className="relative bg-parchment-200 rounded-sm shadow-xl overflow-hidden">
        <div className="h-2 bg-wood-800 border-b border-gold-600"></div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-48 bg-wood-900/95 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-wood-600 bg-wood-pattern">
            <UserBadge
              username={author.username}
              role={author.role}
              avatarUrl={author.avatarUrl}
            />

            <div className="mt-6 w-full space-y-2">
              <div className="flex justify-between text-xs text-parchment-400">
                <span>Posts:</span>
                <span className="text-gold-500">{author.postCount}</span>
              </div>
              <div className="flex justify-between text-xs text-parchment-400">
                <span>Joined:</span>
                <span className="text-parchment-200">{author.joinDate}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-8 bg-parchment-texture relative">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-wood-400/30">
              <span className="text-xs font-bold text-wood-500 uppercase tracking-widest">
                {new Date(post.createdAt).toLocaleDateString()} •{' '}
                {new Date(post.createdAt).toLocaleTimeString()}
              </span>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-wood-400">#{index + 1}</span>

                {canManage && (
                  <div className="flex items-center gap-2">
                    {!isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={startEdit}
                          className="p-2 rounded-sm border border-wood-400/40 bg-wood-900/10 text-wood-700
                                     hover:text-gold-700 hover:border-gold-600 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(post.id)}
                          className="p-2 rounded-sm border border-wood-400/40 bg-wood-900/10 text-wood-700
                                     hover:text-red-300 hover:border-red-500 hover:bg-red-900/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={saveEdit}
                          disabled={saving}
                          className="p-2 rounded-sm border border-gold-600 bg-gold-600/20 text-wood-900
                                     hover:bg-gold-600/30 transition-colors disabled:opacity-60"
                          title="Save"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={saving}
                          className="p-2 rounded-sm border border-wood-500/50 bg-wood-900/10 text-wood-700
                                     hover:border-wood-600 transition-colors disabled:opacity-60"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="prose prose-stone max-w-none font-serif text-lg text-wood-900 leading-relaxed">
              {!isEditing ? (
                <p>{post.content}</p>
              ) : (
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={saving}
                  className="w-full min-h-40 bg-parchment-100 rounded-sm p-4 shadow-inner-wood text-wood-900 font-serif text-lg leading-relaxed disabled:opacity-60"
                />
              )}
            </div>

            <div className="mt-12 pt-6 border-t border-wood-400/30">
              <div className="flex items-center justify-between">
                <div className="text-sm italic text-wood-600 font-serif">"{author.bio}"</div>
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-wood-500 hover:text-gold-700 transition-colors">
                  <Quote size={14} />
                  Quote
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 bg-wood-800 border-t border-gold-600"></div>
      </div>
    </div>
  )
}
