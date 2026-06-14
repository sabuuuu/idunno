import { Button } from "~/components/ui/button";

interface WindowTitleBarProps {
  label: string;
}

export function WindowTitleBar({ label }: WindowTitleBarProps) {
  return (
    <div
      className="flex items-center justify-between px-1 gap-2 shrink-0 h-[28px] bg-vapor-pink shadow-win98-out"
    >
      {/* Gradient title strip */}
      <div
        className="flex items-center gap-2 flex-1 min-w-0 h-[20px] px-2 select-none bg-linear-to-r from-vapor-rose-dark to-vapor-rose shadow-win98-active"
      >
        <span className="text-[10px] leading-none text-white" aria-hidden="true">♡</span>
        <span
          className="text-white leading-none truncate font-pixel text-[8px] font-bold tracking-wider"
        >
          {label}
        </span>
      </div>

      {/* Window control buttons */}
      <div className="flex items-center gap-0.5 shrink-0">
        {[
          { label: "Minimise", glyph: "—" },
          { label: "Maximise", glyph: "□" },
          { label: "Close", glyph: "✕" },
        ].map(({ label: btnLabel, glyph }) => (
          <Button
            key={btnLabel}
            variant="vapor"
            aria-label={btnLabel}
            className={`w-[18px] h-[18px] flex items-center justify-center p-0 text-vapor-dark bg-[#c9858e] shadow-win98-out ${btnLabel === "Minimise" ? "text-[10px]" : "text-[9px]"
              }`}
          >
            {glyph}
          </Button>
        ))}
      </div>
    </div>
  );
}
