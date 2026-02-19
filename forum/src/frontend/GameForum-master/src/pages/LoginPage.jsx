import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AoeLogo from "../components/auth/AoELogo";
import FrameCard from "../components/auth/FrameCard";
import PasswordInput from "../components/auth/PasswordInput";
import { AuthContext } from "../auth/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext) || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userEmail: email, password }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || data?.authenticated === false) {
        setError(data?.message || "Invalid credentials");
        return;
      }

      if (data?.token && login) {
        login(data.token);
      }

      navigate("/", { replace: true });
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link to="/">
        <AoeLogo subtitle="Join the Conquest" />
      </Link>

      <FrameCard title="Commander Login">
        {error && (
          <div className="mt-4 mb-2 rounded border border-red-700/40 bg-red-900/20 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-amber-300 text-sm font-semibold mb-2 uppercase tracking-wide"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Email Address
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-stone-800/50 border-2 border-amber-900/50 rounded text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-all"
                placeholder="commander@empire.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center text-sm">
            <label className="flex items-center text-amber-200 cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 rounded border-amber-700 bg-stone-800 accent-amber-600"
              />
              <span className="text-xs uppercase tracking-wide">
                Remember me
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded border-2 border-amber-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] uppercase tracking-wider"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {loading ? "Entering..." : "Enter the Empire"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-stone-400 text-sm">
            <span className="uppercase tracking-wide text-xs">
              Don't have an account?
            </span>
            <Link
              to="/register"
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors uppercase tracking-wide ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </FrameCard>

      <p className="text-center text-stone-500 text-xs mt-6 uppercase tracking-widest">
        © Drepturi de autor rezervate
      </p>
    </AuthLayout>
  );
}
