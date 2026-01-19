import React from "react";

export default function Divider({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#9ca3af" }}>
      <div style={{ height: 1, background: "#374151", flex: 1 }} />
      {text ? <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>{text}</span> : null}
      <div style={{ height: 1, background: "#374151", flex: 1 }} />
    </div>
  );
}
