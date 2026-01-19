import React from "react";

export default function GoogleButton({ text = "Continue with Google", onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white text-stone-900 font-semibold py-3 px-4 rounded border border-stone-300 hover:bg-stone-100 transition"
      type="button"
    >
      {text}
    </button>
  );
}
