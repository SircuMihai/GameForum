import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AoeLogo from "../components/AoELogo";
import FrameCard from "../components/FrameCard";

export default function ForgotPage() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = () => {
    console.log("Forgot password:", { email });
    alert("Reset link sent to: " + email);
  };

  return (
    <AuthLayout>
      <AoeLogo subtitle="Password Recovery" />

      <FrameCard title="Forgot Password">
        <p className="text-stone-400 text-sm text-center mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-amber-300 text-sm font-semibold mb-2 uppercase tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
              Email Address
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <input
                type="email"
                className="w-full pl-11 pr-4 py-3 bg-stone-800/50 border-2 border-amber-900/50 rounded text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-all"
                placeholder="commander@empire.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleForgotPassword}
            className="w-full bg-linear-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-white font-bold py-3 px-4 rounded border-2 border-amber-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] uppercase tracking-wider"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Send Reset Link
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors text-sm uppercase tracking-wide">
            ← Back to Login
          </Link>
        </div>
      </FrameCard>

      <p className="text-center text-stone-500 text-xs mt-6 uppercase tracking-widest"></p>
    </AuthLayout>
  );
}
