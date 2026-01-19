import { Link } from 'react-router-dom'
import { MessageSquare, Clock, Pin } from 'lucide-react'
import { users } from '../data/mockData'

export function TopicCard({ topic, index }) {
  const author = users[topic.authorId]

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
          {/* Status Icon */}
          <div className="shrink-0 text-wood-600">
            {topic.isPinned ? (
              <Pin className="w-5 h-5 text-gold-700 fill-gold-700" />
            ) : (
              <MessageSquare className="w-5 h-5 group-hover:text-gold-700 transition-colors" />
            )}
          </div>

          {/* Main */}
          <div className="grow min-w-0">
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
              <span className="font-bold text-wood-700">
                {author?.username || 'Unknown'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {new Date(topic.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="shrink-0 flex flex-col items-end text-right min-w-25 pl-4 border-l border-wood-400/30">
            <span className="text-lg font-bold text-wood-800 font-display">
              {topic.replyCount}
            </span>
            <span className="text-xs uppercase tracking-wide text-wood-500">
              Replies
            </span>
          </div>

          {/* Last Activity */}
          <div className="hidden sm:flex shrink-0 flex-col items-end text-right min-w-30 pl-4">
            <span className="text-xs font-bold text-wood-700">
              Last post by
            </span>
            <span className="text-xs text-wood-600 italic">
              {topic.lastActivity}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
