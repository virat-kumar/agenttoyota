const TOYOTA_RED = "#EB0A1E";

export default function ToyotaHeader({
  isAuthed,
  userName,
  onLogoClick,
  onLogout,
}: {
  isAuthed: boolean;
  userName?: string;
  onLogoClick: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onLogoClick}>
          <svg
            className="h-8 w-10"
            viewBox="0 0 64 48"
            role="img"
            aria-label="Toyota emblem"
            fill="none"
            stroke={TOYOTA_RED}
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <ellipse cx="32" cy="24" rx="28" ry="18" />
            <ellipse cx="32" cy="24" rx="18" ry="12" />
            <ellipse cx="32" cy="24" rx="8" ry="18" transform="rotate(90 32 24)" />
          </svg>
          <span className="tracking-widest font-semibold text-xl" style={{ color: TOYOTA_RED }}>
            TOYOTA
          </span>
        </div>
        {isAuthed ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Welcome,</span>
            <span className="font-semibold text-gray-900">{userName || "User"}</span>
            <button
              onClick={onLogout}
              className="ml-3 inline-flex items-center rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Sign in to continue</div>
        )}
      </div>
    </header>
  );
}