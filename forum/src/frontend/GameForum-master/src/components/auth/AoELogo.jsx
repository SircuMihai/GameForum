import Logo from '../../assets/Logo.png'
export default function AoeLogo({ subtitle }) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center mb-4">
        <img
          src={Logo}
          alt="Age of Empires III"
          className="h-32 w-auto drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        />
      </div>
      {subtitle ? (
        <p className="text-amber-200 text-sm tracking-widest uppercase">{subtitle}</p>
      ) : null}
    </div>
  );
}
