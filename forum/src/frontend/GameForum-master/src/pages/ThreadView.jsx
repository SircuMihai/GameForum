import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ForumLayout } from '../components/layout/ForumLayout'
import { PostCard } from '../components/threadView/PostCard'
import { apiRequest } from '../api'
import { ArrowLeft } from 'lucide-react'
import { AuthContext } from '../auth/AuthContext'

export function ThreadView() {
  const { id } = useParams()

  const subjectId = useMemo(() => {
    const n = Number(id)
    return Number.isFinite(n) ? n : null
  }, [id])

  const { user, isAuthed } = useContext(AuthContext) || {}
  const role = String(user?.role || user?.userRole || '').toUpperCase()
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN'

  const [topic, setTopic] = useState(null)
  const [topicPosts, setTopicPosts] = useState([])
  const [category, setCategory] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (subjectId == null) return

    let canceled = false
    ;(async () => {
      try {
        setLoading(true)
        const subject = await apiRequest(`/api/subject/${subjectId}`)
        if (canceled) return

        setTopic({
          id: String(subject.subjectId),
          title: subject.subjectName,
          createdAt: subject.createdAt,
          userNickname: subject.userNickname,
          categoryId: subject.categoryId,
        })

        const msgs = await apiRequest(`/api/message?subjectId=${subjectId}`)
        if (canceled) return

        const mappedPosts = (msgs || []).map((m) => ({
          id: String(m.messageId),
          content: m.messageText,
          createdAt: m.createdAt,
          userNickname: m.userNickname,
          userAvatar: m.userAvatar,
          userRole: m.userRole,
          userQuoto: m.userQuoto,
          userId: m.userId ?? m.user?.userId ?? null,
        }))
        setTopicPosts(mappedPosts)

        if (subject.categoryId != null) {
          const cat = await apiRequest(`/api/category/${subject.categoryId}`)
          if (canceled) return
          setCategory({
            id: String(cat.categoryId),
            title: cat.categoryName,
          })
        }

        setLoading(false)
      } catch {
        if (!canceled) {
          setTopic(null)
          setTopicPosts([])
          setCategory(null)
          setLoading(false)
        }
      }
    })()

    return () => {
      canceled = true
    }
  }, [subjectId])

  const handleSendReply = async () => {
    if (!isAuthed || !user?.userId) return
    const text = replyText.trim()
    if (!text) return
    if (sending) return

    try {
      setSending(true)
      const now = new Date().toISOString()
      const created = await apiRequest('/api/message', {
        method: 'POST',
        body: JSON.stringify({
          messageText: text,
          messagesPhoto: null,
          messageLikes: '0',
          createdAt: now,
          subjectId,
          userId: user.userId,
        }),
      })

      setTopicPosts((prev) => [
        ...prev,
        {
          id: String(created.messageId),
          content: created.messageText,
          createdAt: created.createdAt,
          userNickname: created.userNickname,
          userAvatar: created.userAvatar,
          userRole: created.userRole,
          userId: created.userId ?? user.userId,
        },
      ])
      setReplyText('')
    } finally {
      setSending(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!isAuthed || !isAdmin) return
    const ok = window.confirm('Ștergi mesajul?')
    if (!ok) return

    try {
      await apiRequest(`/api/message/${postId}`, { method: 'DELETE' })
      setTopicPosts((prev) => prev.filter((p) => p.id !== String(postId)))
    } catch {
      alert('Nu am putut șterge mesajul.')
    }
  }

  const normalizeMessage = (m) => {
    const subjectIdVal = m?.subjectId ?? m?.subject?.subjectId ?? m?.subject?.id ?? m?.subject ?? null
    const userIdVal = m?.userId ?? m?.user?.userId ?? m?.user?.id ?? m?.user ?? null
    return {
      messageId: m?.messageId ?? m?.id ?? null,
      messageText: m?.messageText ?? m?.content ?? '',
      messagesPhoto: m?.messagesPhoto ?? m?.messagePhoto ?? m?.photo ?? null,
      messageLikes: m?.messageLikes ?? m?.likes ?? '0',
      createdAt: m?.createdAt ?? m?.created_at ?? null,
      subjectId: subjectIdVal != null ? Number(subjectIdVal) : null,
      userId: userIdVal != null ? Number(userIdVal) : null,
    }
  }

  const handleEditPost = async (postId, newText) => {
    if (!isAuthed || !isAdmin) return
    const text = (newText || '').trim()
    if (!text) return

    try {
      const existingRaw = await apiRequest(`/api/message/${postId}`)
      const existing = normalizeMessage(existingRaw)

      const payload = {
        messageText: text,
        messagesPhoto: existing.messagesPhoto,
        messageLikes: existing.messageLikes,
        createdAt: existing.createdAt,
        subjectId: existing.subjectId ?? Number(subjectId),
        userId: existing.userId ?? user?.userId,
      }

      const updated = await apiRequest(`/api/message/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })

      setTopicPosts((prev) =>
        prev.map((p) =>
          p.id === String(postId)
            ? { ...p, content: updated?.messageText ?? text }
            : p
        )
      )
    } catch {
      alert('Nu am putut edita mesajul.')
    }
  }

  if (subjectId == null) {
    return (
      <ForumLayout>
        <div className="max-w-5xl mx-auto">Topic not found</div>
      </ForumLayout>
    )
  }

  if (loading) {
    return (
      <ForumLayout>
        <div className="max-w-5xl mx-auto">Loading...</div>
      </ForumLayout>
    )
  }

  if (!topic) {
    return (
      <ForumLayout>
        <div className="max-w-5xl mx-auto">Topic not found</div>
      </ForumLayout>
    )
  }

  return (
    <ForumLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            to={category?.id ? `/category/${category.id}` : '/'}
            className="inline-flex items-center gap-2 text-wood-400 hover:text-gold-400 transition-colors text-sm font-bold uppercase tracking-wider mb-4"
          >
            <ArrowLeft size={14} /> Back to {category?.title}
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-wood-600 pb-6">
            <div>
              <h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-display font-bold text-parchment-100 text-shadow-black leading-tight"
              >
                {topic.title}
              </h1>

              <div className="flex items-center gap-4 mt-2 text-sm text-parchment-400">
                <span>
                  Started by{' '}
                  <span className="text-gold-500 font-bold">
                    {topic.userNickname || 'Unknown'}
                  </span>
                </span>
                <span>•</span>
                <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {topicPosts.map((post, index) => {
            const canManage = isAuthed && isAdmin

            return (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                canManage={canManage}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
              />
            )
          })}
        </div>

        <div className="mt-12 bg-wood-900/90 border border-wood-600 p-6 rounded-sm">
          <h3 className="text-lg font-display font-bold text-parchment-200 mb-4">
            Quick Reply
          </h3>

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            disabled={!isAuthed}
            className="bg-parchment-100 rounded-sm p-4 min-h-37.5 mb-4 shadow-inner-wood w-full text-wood-900 font-serif text-lg leading-relaxed disabled:opacity-60"
            placeholder={
              isAuthed
                ? 'Write your message here, commander...'
                : 'Log in to reply...'
            }
          />

          <div className="flex justify-end">
            <button
              onClick={handleSendReply}
              disabled={!isAuthed || sending}
              className="bg-gold-600 text-wood-900 px-8 py-3 rounded-sm font-bold font-display shadow-glow-gold border border-gold-400 hover:bg-gold-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </ForumLayout>
  )
}
