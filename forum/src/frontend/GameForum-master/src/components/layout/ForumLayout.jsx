import { useContext, useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Home, User, Settings, Menu, LogOut, Crown, X } from "lucide-react";
import { AuthContext } from "../../auth/AuthContext";

export function ForumLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const auth = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🎵 music
  const audioRef = useRef(null);
  const [musicReady, setMusicReady] = useState(false);

  const applyMusicSetting = () => {
    const a = audioRef.current;
    if (!a) return;

    const enabled = localStorage.getItem("musicEnabled");
    const musicEnabled = enabled === null ? true : enabled === "true";

    if (!musicEnabled) {
      a.pause();
      a.currentTime = 0;
      setMusicReady(false);
      return;
    }

    a.volume = 0.3;

    // porneste doar daca user a interactionat (browser policy)
    a.play()
      .then(() => setMusicReady(true))
      .catch(() => {});
  };

  useEffect(() => {
    const tryPlayAfterInteraction = () => applyMusicSetting();

    // aplica la load
    applyMusicSetting();

    // porneste dupa prima interactiune
    window.addEventListener("pointerdown", tryPlayAfterInteraction, { once: true });
    window.addEventListener("keydown", tryPlayAfterInteraction, { once: true });

    // cand apesi Save in Options
    window.addEventListener("music-settings-changed", applyMusicSetting);

    return () => {
      window.removeEventListener("pointerdown", tryPlayAfterInteraction);
      window.removeEventListener("keydown", tryPlayAfterInteraction);
      window.removeEventListener("music-settings-changed", applyMusicSetting);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeUserId = (value) => {
    if (value == null) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;

    const s = String(value).trim();
    const cleaned = s.startsWith("u") || s.startsWith("U") ? s.slice(1) : s;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };

  const rawUser = auth?.user || null;

  const role = String(rawUser?.role || rawUser?.userRole || "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  const isAuthenticated =
    !!localStorage.getItem("token") ||
    !!localStorage.getItem("accessToken") ||
    !!localStorage.getItem("jwt");

  const displayUser = rawUser
    ? {
        username: rawUser?.nickname || rawUser?.username || "",
        avatarUrl: rawUser?.avatar || "",
        userId: normalizeUserId(rawUser?.userId),
      }
    : null;

  const handleLogout = () => {
    if (typeof auth?.logout === "function") {
      auth.logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("jwt");
    }
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  const avatarSrc = useMemo(() => {
    const a = displayUser?.avatarUrl || "";
    if (!a) return "";
    if (a.startsWith("data:") || a.startsWith("http") || a.startsWith("/"))
      return a;
    return `data:image/png;base64,${a}`;
  }, [displayUser?.avatarUrl]);

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-0" />

      <header className="sticky top-0 z-50 w-full bg-wood-900 border-b-2 border-gold-700 shadow-xl">
        <div className="h-1 w-full bg-linear-to-r from-wood-900 via-gold-600 to-wood-900" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group" onClick={closeMobile}>
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
                to={displayUser?.userId ? `/user/${displayUser.userId}` : "/login"}
                icon={<User size={18} />}
                label="My Profile"
                active={displayUser?.userId ? isActive(`/user/${displayUser.userId}`) : false}
              />

              <NavLink to="/options" icon={<Settings size={18} />} label="Options" active={isActive("/options")} />

              {isAdmin && (
                <NavLink to="/admin" icon={<Crown size={18} />} label="Admin" active={isActive("/admin")} />
              )}
            </nav>

            <button
              className="md:hidden p-2 text-gold-500"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="hidden md:flex items-center gap-3 pl-6 border-l border-wood-700 ml-6">
              {!isAuthenticated || !displayUser ? (
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
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-wood-800" />
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-sm border border-red-600 bg-red-900/20 text-red-300 hover:bg-red-900/30 transition flex items-center justify-center"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-wood-700 bg-wood-900">
            <div className="px-4 py-3 space-y-1">
              <MobileLink to="/" icon={<Home size={18} />} label="Home City" onClick={closeMobile} />

              <MobileLink
                to={displayUser?.userId ? `/user/${displayUser.userId}` : "/login"}
                icon={<User size={18} />}
                label="My Profile"
                onClick={closeMobile}
              />

              <MobileLink to="/options" icon={<Settings size={18} />} label="Options" onClick={closeMobile} />

              {isAdmin && (
                <MobileLink to="/admin" icon={<Crown size={18} />} label="Admin" onClick={closeMobile} />
              )}

              <div className="pt-3 mt-3 border-t border-wood-700">
                {!isAuthenticated || !displayUser ? (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={closeMobile}
                      className="flex-1 px-4 py-2 rounded-sm border border-gold-700 bg-wood-800/40 text-gold-400 font-display font-bold text-sm text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobile}
                      className="flex-1 px-4 py-2 rounded-sm border border-gold-600 bg-gold-700/20 text-gold-300 font-display font-bold text-sm text-center"
                    >
                      Sign up
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-gold-600 rounded-sm overflow-hidden shrink-0">
                        {avatarSrc ? (
                          <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-wood-800" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gold-400 font-display font-bold text-sm">
                          {displayUser.username}
                        </span>
                        <span className="text-wood-400 text-xs">{role || "USER"}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-10 h-10 rounded-sm border border-red-600 bg-red-900/20 text-red-300 hover:bg-red-900/30 transition flex items-center justify-center"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="h-1 w-full bg-wood-800 border-t border-wood-700" />
      </header>

      {/* 🎵 Background Music */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/aoe3.mp3" type="audio/mpeg" />
      </audio>

      <main className="grow relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      <footer className="relative z-10 bg-wood-900 border-t border-gold-700 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-bronze-500 font-serif italic">"History is written by the victors."</p>
          <p className="text-wood-600 text-xs mt-4 uppercase tracking-widest">Imperial Forum Concept</p>
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

function MobileLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-sm text-parchment-300 hover:bg-wood-800/60 transition"
    >
      <span className="text-wood-500">{icon}</span>
      <span className="font-display font-bold text-sm">{label}</span>
    </Link>
  );
}
