import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f172a",
      color: "#e2e8f0",
      padding: "24px"
    }}>
      <div style={{ width: "100%", maxWidth: 480 }}>{children}</div>
    </div>
  );
}
