import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { apiRequest } from "../api";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

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

    let canceled = false;
    (async () => {
      try {
        setLoadingUser(true);
        const me = await apiRequest("/api/auth/me", { token });
        if (!canceled) setUser(me);
      } catch {
        if (!canceled) setUser(null);
      } finally {
        if (!canceled) setLoadingUser(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, loadingUser, login, logout, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
