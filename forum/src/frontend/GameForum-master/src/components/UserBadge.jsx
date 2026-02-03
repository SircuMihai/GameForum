import React from 'react'
import { User, Shield, Crown } from 'lucide-react'

export function UserBadge({
  username,
  role,
  avatarUrl,
  className = '',
  onClick,
}) {
  const getFrameColor = () => {
    switch (role) {
      case 'admin':
        return 'border-gold-500 shadow-glow-gold'
      case 'moderator':
        return 'border-silver-400'
      default:
        return 'border-bronze-500'
    }
  }

  const getRoleIcon = () => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-gold-500 fill-gold-500" />
      case 'moderator':
        return <Shield className="w-4 h-4 text-silver-400 fill-silver-400" />
      default:
        return null
    }
  }

  return (
    <div
      className={`flex flex-col items-center gap-2 group ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`relative p-1 border-2 rounded-sm bg-wood-800 ${getFrameColor()} transition-transform duration-300 group-hover:scale-105`}
      >
        <div className="relative w-20 h-20 overflow-hidden border border-wood-600 bg-wood-900">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-wood-500">
              <User size={32} />
            </div>
          )}

          {/* Corner ornaments */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold-500 opacity-50" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold-500 opacity-50" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold-500 opacity-50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold-500 opacity-50" />
        </div>

        {/* Role Icon */}
        {role !== 'user' && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-wood-900 border border-gold-700 rounded-full p-1 shadow-md z-10">
            {getRoleIcon()}
          </div>
        )}
      </div>

      <div className="text-center mt-1">
        <span
          className={`font-display font-bold text-lg tracking-wide ${
            role === 'admin'
              ? 'text-gold-400'
              : role === 'moderator'
              ? 'text-silver-400'
              : 'text-parchment-200'
          }`}
        >
          {username}
        </span>
        <div className="text-xs uppercase tracking-widest text-wood-500 font-bold mt-0.5">
          {role}
        </div>
      </div>
    </div>
  )
}
