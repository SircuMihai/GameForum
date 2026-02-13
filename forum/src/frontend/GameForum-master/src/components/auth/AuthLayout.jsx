export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('./images/aoe-3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/30 z-0" />
      <div className="absolute top-0 left-0 w-64 h-64 border-l-4 border-t-4 border-amber-600/30 z-0" />
      <div className="absolute bottom-0 right-0 w-64 h-64 border-r-4 border-b-4 border-amber-600/30 z-0" />
      <div className="w-full max-w-md z-10">{children}</div>
    </div>
  );
}
