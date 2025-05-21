export function FloatingBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      {/* User Avatars */}
      <div className="absolute top-[15%] left-[8%] animate-float-slow opacity-40">
        <img
          src="/assets/henry.svg"
          alt=""
          className="w-12 h-12 rounded-full border border-zinc-700/30"
        />
      </div>
      <div className="absolute bottom-[25%] right-[12%] animate-float-delayed opacity-40">
        <img
          src="/assets/muniz.svg"
          alt=""
          className="w-10 h-10 rounded-full border border-zinc-700/30"
        />
      </div>
      <div className="absolute top-[35%] right-[20%] animate-float opacity-40">
        <img
          src="/assets/ruth.svg"
          alt=""
          className="w-14 h-14 rounded-full border border-zinc-700/30"
        />
      </div>
      <div className="absolute top-[35%] right-[20%] animate-float opacity-40">
        <img
          src="/assets/sarah.svg"
          alt=""
          className="w-14 h-14 rounded-full border border-zinc-700/30"
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[45%] left-[25%] animate-float-slow opacity-20">
        <img
          src="/assets/ruth.svg"
          alt=""
          className="w-14 h-14 rounded-full border border-zinc-700/30"
        />
      </div>
      <div className="absolute bottom-[30%] left-[15%] animate-float opacity-20">
        <img
          src="/assets/sarah.svg"
          alt=""
          className="w-14 h-14 rounded-full border border-zinc-700/30"
        />
      </div>
      <div className="absolute top-[20%] right-[28%] animate-float-delayed opacity-20">
        <img
          src="/assets/muniz.svg"
          alt=""
          className="w-14 h-14 rounded-full border border-zinc-700/30"
        />
      </div>

      {/* Grid Pattern - confined to hero section */}
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      <div>
        {/* Add a fade-out gradient at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900 to-transparent"></div>
      </div>
    </div>
  );
}
