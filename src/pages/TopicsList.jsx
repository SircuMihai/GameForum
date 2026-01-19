import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ForumLayout } from '../components/ForumLayout'
import { TopicCard } from '../components/TopicCard'
import { categories, topics } from '../data/mockData'
import { ArrowLeft, PlusCircle } from 'lucide-react'

export function TopicsList() {
  const { id } = useParams()

  const category = categories.find((c) => c.id === id)
  const categoryTopics = topics.filter((t) => t.categoryId === id)

  if (!category) return <div>Category not found</div>

  return (
    <ForumLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
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

            <p className="text-parchment-300 font-serif mt-1">
              {category.description}
            </p>
          </div>
          <button
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => (window.location.href = `/new-topic?category=${id}`)}
            className="flex items-center gap-2 bg-gold-600 text-wood-900 px-6 py-3 rounded-sm font-bold font-display shadow-glow-gold border border-gold-400 hover:bg-gold-500 transition-colors"
          >
            <PlusCircle size={18} />
            New Topic
          </button>
        </div>

        {/* Topics */}
        <div className="bg-wood-900/60 backdrop-blur-sm p-1 rounded-sm border border-wood-700">
          <div className="hidden sm:flex px-4 py-2 text-xs font-bold text-wood-500 uppercase tracking-widest border-b border-wood-700 mb-2">
            <div className="grow">Topic</div>
            <div className="w-25 text-right pl-4">Stats</div>
            <div className="w-30 text-right pl-4">Last Post</div>
          </div>

          <div className="space-y-1">
            {categoryTopics.map((topic, index) => (
              <TopicCard key={topic.id} topic={topic} index={index} />
            ))}
          </div>

          {categoryTopics.length === 0 && (
            <div className="text-center py-12 text-parchment-400 font-serif italic">
              No topics found in this territory yet. Be the first to scout it!
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 flex items-center justify-center font-display font-bold rounded-sm border 
                ${
                  page === 1
                    ? 'bg-gold-600 text-wood-900 border-gold-400'
                    : 'bg-wood-800 text-parchment-400 border-wood-600 hover:border-gold-500'
                }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </ForumLayout>
  )
}
