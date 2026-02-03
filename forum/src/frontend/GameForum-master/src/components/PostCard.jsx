import React from 'react'
import { UserBadge } from './UserBadge'
import { Quote } from 'lucide-react'

export function PostCard({ post, index }) {
  const author = {
    username: post?.userNickname || 'Unknown',
    role: post?.userRole || 'user',
    avatarUrl: post?.userAvatar,
    postCount: post?.userPostCount ?? 0,
    joinDate: post?.userJoinDate ?? '-',
    bio: post?.userBio ?? '',
  }

  return (
    <div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-8"
    >
      <div className="relative bg-parchment-200 rounded-sm shadow-xl overflow-hidden">
        {/* Top Decorative Border */}
        <div className="h-2 bg-wood-800 border-b border-gold-600"></div>

        <div className="flex flex-col md:flex-row">
          {/* Author Sidebar */}
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

          {/* Post Content */}
          <div className="flex-1 p-6 md:p-8 bg-parchment-texture relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-wood-400/30">
              <span className="text-xs font-bold text-wood-500 uppercase tracking-widest">
                {new Date(post.createdAt).toLocaleDateString()} •{' '}
                {new Date(post.createdAt).toLocaleTimeString()}
              </span>
              <span className="text-xs font-bold text-wood-400">
                #{index + 1}
              </span>
            </div>

            {/* Body */}
            <div className="prose prose-stone max-w-none font-serif text-lg text-wood-900 leading-relaxed">
              <p>{post.content}</p>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-wood-400/30">
              <div className="flex items-center justify-between">
                <div className="text-sm italic text-wood-600 font-serif">
                  "{author.bio}"
                </div>
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-wood-500 hover:text-gold-700 transition-colors">
                  <Quote size={14} />
                  Quote
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Border */}
        <div className="h-1 bg-wood-800 border-t border-gold-600"></div>
      </div>
    </div>
  )
}
