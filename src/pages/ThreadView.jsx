import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ForumLayout } from '../components/ForumLayout'
import { PostCard } from '../components/PostCard'
import { topics, posts, categories } from '../data/mockData'
import { ArrowLeft, Reply } from 'lucide-react'

export function ThreadView() {
  const { id } = useParams()

  const topic = topics.find((t) => t.id === id)
  const topicPosts = posts.filter((p) => p.topicId === id)
  const category = categories.find((c) => c.id === topic?.categoryId)

  if (!topic) return <div>Topic not found</div>

  return (
    <ForumLayout>
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to={`/category/${category?.id}`}
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
                    {topic.authorId === 'u1'
                      ? 'Napoleon_Bonaparte'
                      : 'Queen_Isabella'}
                  </span>
                </span>
                <span>•</span>
                <span>
                  {new Date(topic.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-wood-800 text-parchment-200 px-5 py-2 rounded-sm font-bold font-display border border-wood-500 hover:border-gold-500 hover:text-gold-400 transition-colors">
              <Reply size={16} />
              Post Reply
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-8">
          {topicPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Quick Reply */}
        <div className="mt-12 bg-wood-900/90 border border-wood-600 p-6 rounded-sm">
          <h3 className="text-lg font-display font-bold text-parchment-200 mb-4">
            Quick Reply
          </h3>

          <div className="bg-parchment-100 rounded-sm p-4 min-h-37.5 mb-4 shadow-inner-wood">
            <span className="text-wood-400 font-serif italic">
              Write your message here, commander...
            </span>
          </div>

          <div className="flex justify-end">
            <button className="bg-gold-600 text-wood-900 px-8 py-3 rounded-sm font-bold font-display shadow-glow-gold border border-gold-400 hover:bg-gold-500 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </ForumLayout>
  )
}
