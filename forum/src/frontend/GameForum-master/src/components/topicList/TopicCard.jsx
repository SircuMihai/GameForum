import React from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Clock, Pin, Trash2, Edit3, X, Check } from 'lucide-react'

export function TopicCard({
  topic,
  index,
  canManage,
  onDelete,
  onStartEdit,
  isEditing,
  editTitle,
  setEditTitle,
  setEditPhoto,
  onCancelEdit,
  onSaveEdit,
  editSaving,
}) {
  const authorName = topic?.authorName || topic?.userNickname || 'Unknown'
  const createdAt = topic?.createdAt ? new Date(topic.createdAt) : null

  const photoSrc = (() => {
    const raw = topic?.subjectPhoto
    if (!raw) return ''
    const v = String(raw).trim()
    if (!v) return ''
    if (v.startsWith('data:')) return v
    if (v.startsWith('http://') || v.startsWith('https://')) return v
    if (v.startsWith('/')) return v
    return `data:image/png;base64,${v}`
  })()

  const handleDeleteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.(topic.id)
  }

  const handleEditClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onStartEdit?.(topic)
  }

  const handleCancel = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onCancelEdit?.()
  }

  const handleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onSaveEdit?.(topic.id)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSave(e)
    if (e.key === 'Escape') handleCancel(e)
  }

  return (
    <div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/topic/${topic.id}`} className="block group">
        <div
          className={`
            relative flex items-center gap-4 p-4 mb-2 rounded-sm border
            transition-all duration-200
            ${
              topic.isPinned
                ? 'bg-parchment-200 border-gold-600 shadow-md'
                : 'bg-parchment-300/90 border-wood-300 hover:bg-parchment-200 hover:border-gold-500 hover:shadow-glow-bronze'
            }
          `}
        >
          <div className="shrink-0 flex items-center gap-3">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt=""
                className="w-12 h-12 rounded-sm object-cover border border-wood-400/40"
              />
            ) : (
              <div className="shrink-0 text-wood-600">
                {topic.isPinned ? (
                  <Pin className="w-5 h-5 text-gold-700 fill-gold-700" />
                ) : (
                  <MessageSquare className="w-5 h-5 group-hover:text-gold-700 transition-colors" />
                )}
              </div>
            )}
          </div>

          <div className="grow min-w-0">
            {!isEditing ? (
              <>
                <h4
                  className={`
                    text-lg font-display font-bold truncate pr-4
                    ${
                      topic.isPinned
                        ? 'text-wood-900'
                        : 'text-wood-800 group-hover:text-wood-900'
                    }
                  `}
                >
                  {topic.title}
                </h4>

                <div className="flex items-center gap-3 text-xs text-wood-600 font-serif mt-1">
                  <span className="font-bold text-wood-700">{authorName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {createdAt ? createdAt.toLocaleDateString() : ''}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle?.(e.target.value)}
                  onKeyDown={onKeyDown}
                  autoFocus
                  className="w-full bg-parchment-100 text-wood-900 font-display font-bold px-3 py-2 rounded-sm border border-wood-400 focus:outline-none focus:border-gold-600"
                  disabled={editSaving}
                />

                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      e.target.value = ''
                      if (!file || !setEditPhoto) return
                      const reader = new FileReader()
                      const dataUrl = await new Promise((resolve, reject) => {
                        reader.onload = () => resolve(String(reader.result || ''))
                        reader.onerror = () => reject(new Error('Failed to read file'))
                        reader.readAsDataURL(file)
                      })
                      setEditPhoto(dataUrl)
                    }}
                    disabled={editSaving}
                    className="w-full text-sm text-wood-800 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border file:border-wood-400 file:bg-parchment-100 file:text-wood-900 hover:file:border-gold-600 disabled:opacity-60"
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={editSaving}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-gold-600 bg-gold-600 text-wood-900 font-bold hover:bg-gold-500 disabled:opacity-60"
                  >
                    <Check size={14} />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={editSaving}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-wood-500 bg-wood-900/10 text-wood-800 font-bold hover:bg-wood-900/20 disabled:opacity-60"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 flex flex-col items-end text-right min-w-25 pl-4 border-l border-wood-400/30">
            <span className="text-lg font-bold text-wood-800 font-display">
              {topic.replyCount}
            </span>
            <span className="text-xs uppercase tracking-wide text-wood-500">
              Replies
            </span>
          </div>

          <div className="hidden sm:flex shrink-0 flex-col items-end text-right min-w-30 pl-4">
            <span className="text-xs font-bold text-wood-700">Last post by</span>
            <span className="text-xs text-wood-600 italic">{topic.lastActivity}</span>
          </div>

          <div className="shrink-0 ml-2 flex items-center gap-2">
            {canManage ? (
              <>
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="p-2 rounded-sm border border-wood-400/40 bg-wood-900/20 text-wood-700
                         hover:text-gold-700 hover:border-gold-600 hover:bg-gold-900/10 transition-colors"
                  title="Edit topic"
                  disabled={isEditing || editSaving}
                >
                  <Edit3 size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="p-2 rounded-sm border border-wood-400/40 bg-wood-900/20 text-wood-700
                         hover:text-red-300 hover:border-red-500 hover:bg-red-900/10 transition-colors"
                  title="Delete topic"
                  disabled={editSaving}
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  )
}
