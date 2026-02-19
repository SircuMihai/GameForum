import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { TopicCard } from '../components/topicList/TopicCard'
import { apiRequest } from '../api'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import { AuthContext } from '../auth/AuthContext'

export function TopicsList() {
  const { id } = useParams()
  const pageSize = 10

  const { user } = useContext(AuthContext) || {}
  const role = String(user?.role || user?.userRole || '').toUpperCase()
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN'
  const isModerator = role === 'MODERATOR' || role === 'ROLE_MODERATOR'
  const canManage = isAdmin || isModerator

  const categoryId = useMemo(() => {
    const n = Number(id)
    return Number.isFinite(n) ? n : null
  }, [id])

  const [category, setCategory] = useState(null)
  const [categoryTopics, setCategoryTopics] = useState([])
  const [page, setPage] = useState(1)

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPhoto, setEditPhoto] = useState(null)
  const [editSaving, setEditSaving] = useState(false)


  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(categoryTopics.length / pageSize))
  }, [categoryTopics.length])

  const pagedTopics = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * pageSize
    return categoryTopics.slice(start, start + pageSize)
  }, [categoryTopics, page, totalPages])

  useEffect(() => {
    if (categoryId == null) return

    let canceled = false
    ;(async () => {
      try {
        const [cat, subjects] = await Promise.all([
          apiRequest(`/api/category/${categoryId}`),
          apiRequest(`/api/subject?categoryId=${categoryId}`),
        ])

        if (canceled) return

        setCategory({
          id: String(cat.categoryId),
          title: cat.categoryName,
          description: cat.categoryDescription || '',
        })

        const mappedTopics = (subjects || []).map((s) => ({
          id: String(s.subjectId),
          title: s.subjectName,
          subjectPhoto: s.subjectPhoto,
          createdAt: s.createdAt,
          replyCount: s.replyCount ?? 0,
          userNickname: s.userNickname,
          authorName: s.authorName,
          lastActivity: s.createdAt ? new Date(s.createdAt).toLocaleString() : '-',
          isPinned: false,
        }))

        setCategoryTopics(mappedTopics)
        setPage(1)
        setEditingId(null)
        setEditTitle('')
      } catch {
        if (!canceled) {
          setCategory(null)
          setCategoryTopics([])
          setPage(1)
          setEditingId(null)
          setEditTitle('')
        }
      }
    })()

    return () => {
      canceled = true
    }
  }, [categoryId])

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages])

  const handleDeleteTopic = async (topicId) => {
    if (!canManage) return
    const ok = window.confirm('Ștergi topicul?')
    if (!ok) return
    try {
      await apiRequest(`/api/subject/${topicId}`, { method: 'DELETE' })
      setCategoryTopics((prev) => prev.filter((t) => t.id !== String(topicId)))
      setEditingId((cur) => (String(cur) === String(topicId) ? null : cur))
    } catch {
      alert('Nu am putut șterge topicul.')
    }
  }

  const startEdit = (topic) => {
    if (!canManage) return
    setEditingId(String(topic.id))
    setEditTitle(topic.title || '')
    setEditPhoto(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditPhoto(null)
  }

  const normalizeSubject = (s) => {
    const categoryIdVal =
      s?.categoryId ??
      s?.category?.categoryId ??
      s?.category?.id ??
      s?.category ??
      null

    const userIdVal =
      s?.userId ??
      s?.user?.userId ??
      s?.user?.id ??
      s?.user ??
      null

    return {
      subjectId: s?.subjectId ?? s?.id ?? null,
      subjectName: s?.subjectName ?? s?.name ?? '',
      subjectText: s?.subjectText ?? s?.text ?? '',
      subjectPhoto: s?.subjectPhoto ?? s?.photo ?? null,
      subjectLikes: s?.subjectLikes ?? s?.likes ?? '0',
      createdAt: s?.createdAt ?? s?.created_at ?? null,
      categoryId: categoryIdVal != null ? Number(categoryIdVal) : null,
      userId: userIdVal != null ? Number(userIdVal) : null,
    }
  }

  const saveEdit = async (topicId) => {
    const newTitle = (editTitle || '').trim()
    if (!newTitle) {
      alert('Titlul nu poate fi gol.')
      return
    }

    setEditSaving(true)
    try {
      const existingRaw = await apiRequest(`/api/subject/${topicId}`)
      const existing = normalizeSubject(existingRaw)

      const payload = {
        subjectName: newTitle,
        subjectText: existing.subjectText,
        subjectPhoto: existing.subjectPhoto,
        subjectLikes: existing.subjectLikes,
        createdAt: existing.createdAt,
        categoryId: existing.categoryId ?? Number(categoryId),
        userId: existing.userId,
      }

      await apiRequest(`/api/subject/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (editPhoto) {
        await apiRequest(`/api/subject/${topicId}/photo`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subjectPhoto: editPhoto }),
        })
      }

      setCategoryTopics((prev) =>
        prev.map((t) => (t.id === String(topicId) ? { ...t, title: newTitle } : t))
      )

      setEditingId(null)
      setEditTitle('')
      setEditPhoto(null)
    } catch {
      alert('Nu am putut edita topicul.')
    } finally {
      setEditSaving(false)
    }
  }

  if (!category) return <div>Category not found</div>

  return (
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-wood-400 hover:text-gold-400 mb-2 transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Home City
            </Link>

            <h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-display font-bold text-parchment-100 text-shadow-black"
            >
              {category.title}
            </h1>

            <p className="text-parchment-300 font-serif mt-1">{category.description}</p>
          </div>

          <button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = `/new-topic?category=${id}`)}
            className="flex items-center gap-2 bg-gold-600 text-wood-900 px-6 py-3 rounded-sm font-bold font-display shadow-glow-gold border border-gold-400 hover:bg-gold-500 transition-colors"
          >
            <PlusCircle size={18} />
            New Topic
          </button>
        </div>

        <div className="bg-wood-900/60 backdrop-blur-sm p-1 rounded-sm border border-wood-700">
          <div className="hidden sm:flex px-4 py-2 text-xs font-bold text-wood-500 uppercase tracking-widest border-b border-wood-700 mb-2">
            <div className="grow">Topic</div>
            <div className="w-25 text-right pl-4">Stats</div>
            <div className="w-30 text-right pl-4">Last Post</div>
          </div>

          <div className="space-y-1">
            {pagedTopics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                canManage={canManage}
                onDelete={handleDeleteTopic}
                onStartEdit={startEdit}
                isEditing={String(editingId) === String(topic.id)}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                setEditPhoto={setEditPhoto}
                onCancelEdit={cancelEdit}
                onSaveEdit={saveEdit}
                editSaving={editSaving}
              />
            ))}
          </div>

          {categoryTopics.length === 0 && (
            <div className="text-center py-12 text-parchment-400 font-serif italic">
              No topics found in this territory yet. Be the first to scout it!
            </div>
          )}
        </div>

        {categoryTopics.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 flex items-center justify-center font-display font-bold rounded-sm border 
                  ${
                    p === page
                      ? 'bg-gold-600 text-wood-900 border-gold-400'
                      : 'bg-wood-800 text-parchment-400 border-wood-600 hover:border-gold-500'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
  )
}
