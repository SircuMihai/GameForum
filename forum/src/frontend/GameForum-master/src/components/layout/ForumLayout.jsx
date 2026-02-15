import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User, Settings, Menu, LogOut } from "lucide-react";
import { AuthContext } from "../../auth/AuthContext";

export function ForumLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const auth = useContext(AuthContext);

  const normalizeUserId = (value) => {
    if (value == null) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;

    const s = String(value).trim();
    const cleaned = s.startsWith("u") || s.startsWith("U") ? s.slice(1) : s;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };

  const isAuthenticated =
    !!localStorage.getItem("token") ||
    !!localStorage.getItem("accessToken") ||
    !!localStorage.getItem("jwt");

  // user poate fi null => fallback
  const rawUser = auth?.user || null;

  const displayUser = {
    username: rawUser?.nickname || rawUser?.username || "Commander",
    avatarUrl: rawUser?.avatar || "",
    userId: normalizeUserId(rawUser?.userId),
  };

  const handleLogout = () => {
    if (typeof auth?.logout === "function") {
      auth.logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("jwt");
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-0" />

      <header className="sticky top-0 z-50 w-full bg-wood-900 border-b-2 border-gold-700 shadow-xl">
        <div className="h-1 w-full bg-linear-to-r from-wood-900 via-gold-600 to-wood-900" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gold-600 rounded-full flex items-center justify-center border-2 border-wood-400 shadow-glow-gold">
                <img src="/AoE3.png" alt="AoE3" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-gold-400 tracking-widest">
                  IMPERIAL FORUM
                </span>
                <span className="text-xs text-bronze-400 tracking-[0.2em] uppercase font-bold">
                  Age of Empires III
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <NavLink to="/" icon={<Home size={18} />} label="Home City" active={isActive("/")} />
              <NavLink
                to={displayUser.userId ? `/user/${displayUser.userId}` : "/login"}
                icon={<User size={18} />}
                label="My Profile"
                active={displayUser.userId ? isActive(`/user/${displayUser.userId}`) : false}
              />
              <NavLink to="/options" icon={<Settings size={18} />} label="Options" active={isActive("/options")} />
            </nav>

            <button className="md:hidden p-2 text-gold-500">
              <Menu size={24} />
            </button>

            <div className="hidden md:flex items-center gap-3 pl-6 border-l border-wood-700 ml-6">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-sm border border-gold-700 bg-wood-800/40 text-gold-400 font-display font-bold text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-sm border border-gold-600 bg-gold-700/20 text-gold-300 font-display font-bold text-sm"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-end">
                    <span className="text-gold-400 font-display font-bold text-sm">
                      {displayUser.username}
                    </span>
                  </div>

                  <div className="w-10 h-10 border border-gold-600 rounded-sm overflow-hidden">
                    {(() => {
                      const raw = displayUser.avatarUrl
                      if (!raw) return null
                      const v = String(raw).trim()
                      if (!v) return null
                      if (v.startsWith('data:')) return <img src={v} alt="Avatar" className="w-full h-full object-cover" />
                      if (v.startsWith('http://') || v.startsWith('https://')) return <img src={v} alt="Avatar" className="w-full h-full object-cover" />
                      if (v.startsWith('/')) return <img src={v} alt="Avatar" className="w-full h-full object-cover" />
                      return <img src={`data:image/png;base64,${v}`} alt="Avatar" className="w-full h-full object-cover" />
                    })()}
                    {!displayUser.avatarUrl && <div className="w-full h-full bg-wood-800" />}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-sm border border-red-600 bg-red-900/20 text-red-300 hover:bg-red-900/30 transition flex items-center justify-center"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-wood-800 border-t border-wood-700" />
      </header>

      <main className="grow relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="relative z-10 bg-wood-900 border-t border-gold-700 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-bronze-500 font-serif italic">
            "History is written by the victors."
          </p>
          <p className="text-wood-600 text-xs mt-4 uppercase tracking-widest">
            Imperial Forum Concept
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-sm font-display font-bold text-sm transition
        ${
          active
            ? "bg-wood-800 text-gold-400 border border-gold-700"
            : "text-parchment-400 hover:text-gold-300 hover:bg-wood-800/50"
        }`}
    >
      <span className={active ? "text-gold-500" : "text-wood-500"}>{icon}</span>
      {label}
    </Link>
  );
}
