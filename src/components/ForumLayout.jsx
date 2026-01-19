import { Link, useLocation } from 'react-router-dom'
import { Home, User, Settings, Menu } from 'lucide-react'

export function ForumLayout({ children, isAuthenticated = false, user }) {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const displayUser = user ?? {
    username: 'Napoleon_Bonaparte',
    level: 60,
    avatarUrl:
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&q=80&w=100&h=100',
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-0"></div>

      <header className="sticky top-0 z-50 w-full bg-wood-900 border-b-2 border-gold-700 shadow-xl">
        <div className="h-1 w-full bg-linear-to-r from-wood-900 via-gold-600 to-wood-900"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gold-600 rounded-full flex items-center justify-center border-2 border-wood-400 shadow-glow-gold group-hover:scale-110 transition-transform">
                <img src="/public/AoE3.png" alt="" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-gold-400 tracking-widest text-shadow-black group-hover:text-gold-300 transition-colors">
                  IMPERIAL FORUM
                </span>
                <span className="text-xs text-bronze-400 tracking-[0.2em] uppercase font-bold">
                  Age of Empires III
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <NavLink to="/" icon={<Home size={18} />} label="Home City" active={isActive('/')} />
              <NavLink to="/user/u1" icon={<User size={18} />} label="My Profile" active={isActive('/user/u1')} />
              <NavLink to="/options" icon={<Settings size={18} />} label="Options" active={isActive('/options')} />
            </nav>

            <button className="md:hidden p-2 text-gold-500 hover:text-gold-300">
              <Menu size={24} />
            </button>

            <div className="hidden md:flex items-center gap-4 pl-6 border-l border-wood-700 ml-6">
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-sm border border-gold-700 bg-wood-800/40 text-gold-400 font-display font-bold tracking-wide text-sm hover:bg-wood-800 hover:text-gold-300 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-sm border border-gold-600 bg-gold-700/20 text-gold-300 font-display font-bold tracking-wide text-sm hover:bg-gold-700/30 transition"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-end">
                    <span className="text-gold-400 font-display font-bold text-sm">
                      {displayUser.username}
                    </span>
                    <span className="text-xs text-bronze-500 uppercase">
                      Level {displayUser.level}
                    </span>
                  </div>
                  <div className="w-10 h-10 border border-gold-600 rounded-sm overflow-hidden">
                    <img
                      src={displayUser.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-wood-800 border-t border-wood-700"></div>
      </header>

      <main className="grow relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="relative z-10 bg-wood-900 border-t border-gold-700 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-bronze-500 font-serif italic">"History is written by the victors."</p>
          <p className="text-wood-600 text-xs mt-4 uppercase tracking-widest">
             Imperial Forum Concept
          </p>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-sm transition-all duration-200
        font-display font-bold tracking-wide text-sm
        ${
          active
            ? 'bg-wood-800 text-gold-400 border border-gold-700 shadow-inner-wood'
            : 'text-parchment-400 hover:text-gold-300 hover:bg-wood-800/50'
        }
      `}
    >
      <span className={active ? 'text-gold-500' : 'text-wood-500'}>{icon}</span>
      {label}
    </Link>
  )
}
