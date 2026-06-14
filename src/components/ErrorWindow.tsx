import { Button } from "~/components/ui/button";

const GLYPHS = [
  { glyph: "★", left: "8%", top: "10%", size: 16, opacity: 0.12 },
  { glyph: "♥", left: "82%", top: "6%", size: 14, opacity: 0.10 },
  { glyph: "?", left: "5%", top: "55%", size: 18, opacity: 0.09 },
  { glyph: "★", left: "90%", top: "62%", size: 12, opacity: 0.13 },
  { glyph: "♥", left: "15%", top: "80%", size: 16, opacity: 0.08 },
  { glyph: "★", left: "75%", top: "85%", size: 14, opacity: 0.11 },
  { glyph: "?", left: "92%", top: "30%", size: 16, opacity: 0.09 },
  { glyph: "♥", left: "3%", top: "35%", size: 12, opacity: 0.10 },
];

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
  message = "Whoops! This pick got lost in the matrix.",
  subtitle = "even our robot had a bad day ♡",
  body = "We couldn't find a movie match for your current vibe. Maybe the universe wants you to go for a walk? Or try answering the questions again — we promise we're listening this time.",
  primaryLabel = "TRY AGAIN ▶",
  onPrimary,
  secondaryLabel = "START OVER ↺",
  onSecondary = () => { window.location.href = "/ask"; },
}: ErrorWindowProps) {
  return (
    <div className="relative flex flex-col items-center justify-center px-4 py-12 min-h-full">
      <div className="dot-grid absolute inset-0" aria-hidden="true" />
      <div className="crt-overlay absolute inset-0" aria-hidden="true" />

      {GLYPHS.map(({ glyph, left, top, size, opacity }, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{ position: "absolute", left, top, fontSize: `${size}px`, color: "#b76e79", opacity, pointerEvents: "none", userSelect: "none", fontFamily: "'Press Start 2P', monospace", zIndex: 1 }}
        >
          {glyph}
        </div>
      ))}

      <div
        className="z-10 relative w-full h-full max-w-[500px]"
      >

        <div className="relative overflow-hidden px-8 pt-8 pb-7 bg-vapor-cream">
          <div
            className="absolute inset-0 pointer-events-none z-2 [background:repeating-linear-gradient(to_bottom,transparent,transparent_3px,rgba(183,110,121,0.04)_3px,rgba(183,110,121,0.04)_4px)]"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            <div className="inline-block border-2 border-vapor-rose px-3 py-0.5">
              <span className="font-pixel text-[8px] tracking-[0.15em] text-vapor-rose">
                ERR :: MATCH_NOT_FOUND
              </span>
            </div>

            <div>
              <p className="font-retro text-4xl leading-[1.3] text-vapor-dark">{message}</p>
              <p className="mt-2 font-retro text-2xl text-vapor-rose-dark">{subtitle}</p>
            </div>

            <p className="font-sans text-sm leading-[1.7] text-vapor-rose-dark">{body}</p>

            <div className="w-full border-t border-dashed border-vapor-pink" />

            <div className="flex gap-4 justify-center flex-wrap">
              {onPrimary && (
                <Button
                  onClick={onPrimary}
                  variant="vapor"
                  className="font-pixel text-[9px] px-5 py-2.5 h-auto tracking-[0.06em] min-w-[120px] cursor-pointer text-vapor-cream bg-vapor-rose shadow-win98-out"
                >
                  {primaryLabel}
                </Button>
              )}
              <Button
                onClick={onSecondary}
                variant="vapor"
                className="font-pixel text-[9px] px-5 py-2.5 h-auto tracking-[0.06em] min-w-[120px] cursor-pointer text-vapor-dark bg-[#c9858e] shadow-win98-out"
              >
                {secondaryLabel}
              </Button>
            </div>

            <p className="font-pixel text-micro tracking-[0.08em] opacity-60 text-vapor-rose-dark">
              error code: idonnu_404 · build v0.9.8 · ©2001 idonnu corp
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 z-10 font-retro text-lg text-vapor-rose-dark">
        press ESC to go back to safety
      </p>
    </div>
  );
}
