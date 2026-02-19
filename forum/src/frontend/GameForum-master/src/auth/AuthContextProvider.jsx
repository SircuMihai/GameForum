import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { apiRequest } from "../api";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const normalizeUserId = useCallback((value) => {
    if (value == null) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;

    const s = String(value).trim();
    const cleaned = s.startsWith("u") || s.startsWith("U") ? s.slice(1) : s;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }, []);

  const normalizeMe = useCallback((me) => {
    if (!me || typeof me !== "object") return me;
    if (me.userId == null) return me;

    const normalized = normalizeUserId(me.userId);
    return normalized == null ? me : { ...me, userId: normalized };
  }, [normalizeUserId]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    // keep storage in sync in case token was restored differently
    if (localStorage.getItem("token") !== token) {
      localStorage.setItem("token", token);
    }

    let canceled = false;
    (async () => {
      try {
        setLoadingUser(true);
        const me = await apiRequest("/api/auth/me", { token });
        if (!canceled) setUser(normalizeMe(me));
      } catch {
        if (!canceled) setUser(null);
      } finally {
        if (!canceled) setLoadingUser(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [token, normalizeMe]);

  return (
    <AuthContext.Provider value={{ token, user, loadingUser, login, logout, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
