// src/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
// ^ pune ce ai tu dacă api e pe alt host/port

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt")
  );
}

export async function apiRequest(path, options = {}) {
  const token = options?.token || getToken();

  const headers = new Headers(options.headers || {});
  // setează JSON doar dacă trimiți body și nu e deja setat
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // dacă e 401 -> token invalid/expirat sau endpoint protejat
  if (res.status === 401) {
    // opțional: curăță token și trimite user la login
    // localStorage.removeItem("token");
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("jwt");
    throw new Error("Unauthorized");
  }

  // 204 No Content
  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
