import React from "react";

export default function AoeLogo({ size = 48 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          background: "linear-gradient(135deg,#22d3ee,#6366f1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700
        }}
      >
        GF
      </div>
      <span style={{ fontSize: 18, fontWeight: 600 }}>GameForum</span>
    </div>
  );
}
