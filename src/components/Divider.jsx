export default function Divider({ text }) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t-2 border-amber-800/50" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="px-4 bg-stone-900 text-amber-400 uppercase tracking-wider font-semibold">
          {text}
        </span>
      </div>
    </div>
  );
}
