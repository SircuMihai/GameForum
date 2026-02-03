export default function FrameCard({ title, children }) {
  return (
    <div className="bg-linear-to-b from-stone-900/95 to-stone-950/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 border-2 border-amber-700/50 relative">
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-amber-500" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-amber-500" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-amber-500" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-amber-500" />

      {title ? (
        <h2
          className="text-2xl font-bold text-amber-300 mb-6 text-center uppercase tracking-wider"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {title}
        </h2>
      ) : null}

      {children}
    </div>
  );
}
