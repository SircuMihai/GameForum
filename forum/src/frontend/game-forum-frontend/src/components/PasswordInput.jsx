import React from "react";

export default function PasswordInput({ label = "Password", value, onChange }) {
  return (
    <div>
      <label className="block text-amber-300 text-sm font-semibold mb-2 uppercase tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
        {label}
      </label>
      <input
        type="password"
        className="w-full pl-3 pr-4 py-3 bg-stone-800/50 border-2 border-amber-900/50 rounded text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-all"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
