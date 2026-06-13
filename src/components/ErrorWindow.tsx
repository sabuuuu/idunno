import { WindowTitleBar } from "~/components/WindowTitleBar";

// ── Floating ambient glyphs ──────────────────────────────────────────
const GLYPHS = [
  { glyph: "★", left: "8%",  top: "10%", size: 16, opacity: 0.12 },
  { glyph: "♥", left: "82%", top: "6%",  size: 14, opacity: 0.10 },
  { glyph: "?", left: "5%",  top: "55%", size: 18, opacity: 0.09 },
  { glyph: "★", left: "90%", top: "62%", size: 12, opacity: 0.13 },
  { glyph: "♥", left: "15%", top: "80%", size: 16, opacity: 0.08 },
  { glyph: "★", left: "75%", top: "85%", size: 14, opacity: 0.11 },
  { glyph: "?", left: "92%", top: "30%", size: 16, opacity: 0.09 },
  { glyph: "♥", left: "3%",  top: "35%", size: 12, opacity: 0.10 },
];

// ── Main exported component ──────────────────────────────────────────

interface ErrorWindowProps {
  message?: string;
  subtitle?: string;
  body?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function ErrorWindow({
  message        = "Whoops! This pick got lost in the matrix.",
  subtitle       = "even our robot had a bad day ♡",
  body           = "We couldn't find a movie match for your current vibe. Maybe the universe wants you to go for a walk? Or try answering the questions again — we promise we're listening this time.",
  primaryLabel   = "TRY AGAIN ▶",
  onPrimary,
  secondaryLabel = "START OVER ↺",
  onSecondary    = () => { window.location.href = "/ask"; },
}: ErrorWindowProps) {
  return (
    <div className="relative flex flex-col items-center justify-center px-4 py-12 min-h-full">
      <div className="dot-grid absolute inset-0" aria-hidden="true" />
      <div className="crt-overlay absolute inset-0" aria-hidden="true" />

      {/* Floating glyphs */}
      {GLYPHS.map(({ glyph, left, top, size, opacity }, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{ position: "absolute", left, top, fontSize: `${size}px`, color: "#b76e79", opacity, pointerEvents: "none", userSelect: "none", fontFamily: "'Press Start 2P', monospace", zIndex: 1 }}
        >
          {glyph}
        </div>
      ))}

      {/* Window */}
      <div
        className="z-10 relative w-full"
        style={{ maxWidth: "500px", border: "2px solid #b76e79", boxShadow: "4px 4px 0px #b76e79" }}
      >
        <WindowTitleBar label="ERROR_404.EXE" />

        <div className="relative overflow-hidden" style={{ padding: "32px 32px 28px", backgroundColor: "#f4eceb" }}>
          {/* Inner scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(183,110,121,0.04) 3px, rgba(183,110,121,0.04) 4px)", zIndex: 2 }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            {/* Badge */}
            <div style={{ border: "2px solid #b76e79", padding: "3px 12px", display: "inline-block" }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", letterSpacing: "0.15em", color: "#b76e79" }}>
                ERR :: MATCH_NOT_FOUND
              </span>
            </div>

            {/* Message */}
            <div>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: "32px", lineHeight: 1.3, color: "#1a1a1a" }}>{message}</p>
              <p className="mt-2" style={{ fontFamily: "'VT323', monospace", fontSize: "22px", color: "#7a4a52" }}>{subtitle}</p>
            </div>

            {/* Body */}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: 1.7, color: "#7a4a52" }}>{body}</p>

            <div style={{ width: "100%", borderTop: "1px dashed #d4a0a8" }} />

            {/* Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              {onPrimary && (
                <button
                  onClick={onPrimary}
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", padding: "10px 20px", backgroundColor: "#b76e79", color: "#f4eceb", border: "2px solid #b76e79", boxShadow: "inset 1px 1px 0px #d4a0a8, inset -1px -1px 0px #7a4a52, 3px 3px 0px #7a4a52", letterSpacing: "0.06em", minWidth: "120px", cursor: "pointer" }}
                >
                  {primaryLabel}
                </button>
              )}
              <button
                onClick={onSecondary}
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", padding: "10px 20px", backgroundColor: "#f4eceb", color: "#b76e79", border: "2px solid #b76e79", boxShadow: "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #d4a0a8, 3px 3px 0px #b76e79", letterSpacing: "0.06em", minWidth: "120px", cursor: "pointer" }}
              >
                {secondaryLabel}
              </button>
            </div>

            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", letterSpacing: "0.08em", opacity: 0.6, color: "#7a4a52" }}>
              error code: idonnu_404 · build v0.9.8 · ©2001 idonnu corp
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 z-10" style={{ fontFamily: "'VT323', monospace", fontSize: "18px", color: "#7a4a52" }}>
        press ESC to go back to safety
      </p>
    </div>
  );
}
