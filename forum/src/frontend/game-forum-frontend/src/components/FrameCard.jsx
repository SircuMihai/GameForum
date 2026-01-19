import React from "react";

export default function FrameCard({ title, children, footer }) {
  return (
    <div style={{
      background: "#111827",
      border: "1px solid #1f2937",
      borderRadius: 12,
      padding: 20,
      boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
    }}>
      {title ? (
        <div style={{ marginBottom: 12, fontWeight: 700, fontSize: 18 }}>
          {title}
        </div>
      ) : null}
      <div>{children}</div>
      {footer ? (
        <div style={{ marginTop: 16, borderTop: "1px solid #1f2937", paddingTop: 12 }}>
          {footer}
        </div>
      ) : null}
    </div>
  );
}
