interface WindowTitleBarProps {
  label: string;
}

export function WindowTitleBar({ label }: WindowTitleBarProps) {
  return (
    <div
      className="flex items-center justify-between px-1 gap-2 shrink-0"
      style={{
        height: "28px",
        backgroundColor: "#d4a0a8",
        boxShadow:
          "inset 0px 1px 0px #f4eceb, inset 1px 0px 0px #f4eceb, inset 0px -1px 0px #7a4a52, inset -1px 0px 0px #7a4a52",
      }}
    >
      {/* Gradient title strip */}
      <div
        className="flex items-center gap-2 flex-1 min-w-0 h-[20px] px-2 select-none"
        style={{
          background: "linear-gradient(to right, #8a4853, #b76e79)",
          boxShadow: "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52",
        }}
      >
        <span style={{ fontSize: "10px", lineHeight: 1 }} aria-hidden="true">♡</span>
        <span
          className="text-white leading-none truncate"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </span>
      </div>

      {/* Window control buttons */}
      <div className="flex items-center gap-0.5 shrink-0">
        {[
          { label: "Minimise", glyph: "—", fontSize: "10px" },
          { label: "Maximise", glyph: "□", fontSize: "9px"  },
          { label: "Close",    glyph: "✕", fontSize: "9px"  },
        ].map(({ label: btnLabel, glyph, fontSize }) => (
          <button
            key={btnLabel}
            aria-label={btnLabel}
            className="flex items-center justify-center"
            style={{
              width: "18px",
              height: "18px",
              backgroundColor: "#d4a0a8",
              border: "1px solid #1c1b1b",
              boxShadow:
                "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52, inset 2px 2px 0px #d4a0a8, inset -2px -2px 0px #8a4853",
              fontSize,
              fontFamily: "'Space Mono', monospace",
              color: "#1c1b1b",
              cursor: "pointer",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "inset 1px 1px 0px #7a4a52, inset -1px -1px 0px #f4eceb, inset 2px 2px 0px #8a4853";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52, inset 2px 2px 0px #d4a0a8, inset -2px -2px 0px #8a4853";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52, inset 2px 2px 0px #d4a0a8, inset -2px -2px 0px #8a4853";
            }}
          >
            {glyph}
          </button>
        ))}
      </div>
    </div>
  );
}
