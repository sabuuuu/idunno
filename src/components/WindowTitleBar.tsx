// Shared window title bar — used by every card/window in the app.
// Matches the desktop TopBar: #8a4853, Space Mono, 28px, with — □ ✕ buttons.

interface WindowTitleBarProps {
  label: string;
}

export function WindowTitleBar({ label }: WindowTitleBarProps) {
  return (
    <div
      className="flex items-center justify-between px-3 shrink-0"
      style={{
        height: "28px",
        backgroundColor: "#8a4853",
        borderBottom: "2px solid #1c1b1b",
      }}
    >
      <span
        className="text-white uppercase leading-none select-none truncate"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}
      >
        {label}
      </span>

      <div className="flex items-center gap-1.5 shrink-0 ml-3">
        {(["—", "□", "✕"] as const).map((glyph, i) => (
          <button
            key={glyph}
            aria-hidden="true"
            tabIndex={-1}
            className="flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
            style={{
              width: "14px",
              height: "14px",
              border: "1px solid rgba(255,255,255,0.4)",
              fontSize: i === 1 ? "8px" : "9px",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {glyph}
          </button>
        ))}
      </div>
    </div>
  );
}
