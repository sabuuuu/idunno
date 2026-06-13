import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Clapperboard, Heart, Rss, Settings } from "lucide-react";

// ─── Top navbar — Win98 title bar style ────────────────────────────

function TopBar() {
  const CHROME_ACTIONS = [
    {
      label: "Minimise",
      glyph: "—",
      fontSize: "10px",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      label: "Maximise",
      glyph: "□",
      fontSize: "9px",
      onClick: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      },
    },
    {
      label: "Close",
      glyph: "✕",
      fontSize: "9px",
      onClick: () => { window.location.href = "/ask"; },
    },
  ] as const;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-1 gap-2"
      style={{
        height: "28px",
        backgroundColor: "#d4a0a8",
        boxShadow:
          "inset 0px 1px 0px #f4eceb, inset 1px 0px 0px #f4eceb, inset 0px -1px 0px #7a4a52, inset -1px 0px 0px #7a4a52",
      }}
    >
      {/* ── Title strip ── */}
      <div
        className="flex items-center gap-2 flex-1 min-w-0 h-[20px] px-2 select-none"
        style={{
          background: "linear-gradient(to right, #8a4853, #b76e79)",
          boxShadow: "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52",
        }}
      >
        <span style={{ fontSize: "12px", lineHeight: 1 }} aria-hidden="true">♡</span>
        <span
          className="text-white leading-none truncate"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", fontWeight: 700, letterSpacing: "0.05em" }}
        >
          IDONNU.EXE
        </span>
      </div>

      {/* ── Window control buttons ── */}
      <div className="flex items-center gap-0.5 shrink-0">
        {CHROME_ACTIONS.map(({ label, glyph, fontSize, onClick }) => (
          <button
            key={label}
            aria-label={label}
            onClick={onClick}
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
    </header>
  );
}

// ─── Bottom nav — Win98 taskbar style ──────────────────────────────

const NAV_ITEMS = [
  { label: "QUEST", Icon: Clapperboard, to: "/ask" as const },
  { label: "FAVES", Icon: Heart,        to: "/"    as const },
  { label: "FEED",  Icon: Rss,          to: "/"    as const },
  { label: "SETUP", Icon: Settings,     to: "/"    as const },
];

function TaskbarClock() {
  const [time, setTime] = React.useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  );

  React.useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 10_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="flex items-center justify-center px-3 h-full shrink-0"
      style={{
        // inset border = pressed tray look
        boxShadow: "inset 1px 1px 0px #808080, inset -1px -1px 0px #ffffff",
        minWidth: "60px",
      }}
    >
      <span
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "8px",
          color: "#1c1b1b",
          letterSpacing: "0.05em",
        }}
      >
        {time}
      </span>
    </div>
  );
}

function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-1 px-1"
      style={{
        height: "44px",
        backgroundColor: "#d4a0a8",
        // Win98 raised bevel: bright top/left, dark bottom/right
        boxShadow:
          "inset 0px 1px 0px #f4eceb, inset 1px 0px 0px #f4eceb, inset 0px -1px 0px #7a4a52, inset -1px 0px 0px #7a4a52",
      }}
    >
      {/* ── Start button ── */}
      <button
        className="flex items-center gap-1.5 shrink-0 h-[26px] px-2"
        onClick={() => { window.location.href = "/ask"; }}
        style={{
          backgroundColor: "#b76e79",
          boxShadow:
            "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52, inset 2px 2px 0px #d4a0a8, inset -2px -2px 0px #8a4853",
          border: "1px solid #1c1b1b",
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
        <span style={{ fontSize: "14px", lineHeight: 1 }}>♡</span>
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "8px",
            color: "#f4eceb",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          START
        </span>
      </button>

      {/* ── Divider ── */}
      <div
        className="shrink-0 self-stretch my-1"
        style={{
          width: "2px",
          boxShadow: "inset 1px 0px 0px #7a4a52, inset -1px 0px 0px #f4eceb",
        }}
      />

      {/* ── App buttons ── */}
      <div className="flex items-center gap-0.5 flex-1 min-w-0">
        {NAV_ITEMS.map(({ label, Icon, to }) => {
          const isActive = to !== "/" && location.pathname.startsWith(to);
          return (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-1.5 h-[26px] px-2 min-w-0 shrink-0 select-none"
              style={{
                backgroundColor: isActive ? "#b76e79" : "#c9858e",
                border: "1px solid #1c1b1b",
                // Active = pressed in, inactive = raised out
                boxShadow: isActive
                  ? "inset 1px 1px 0px #7a4a52, inset -1px -1px 0px #f4eceb, inset 2px 2px 0px #8a4853"
                  : "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52, inset 2px 2px 0px #d4a0a8, inset -2px -2px 0px #8a4853",
              }}
            >
              <Icon
                size={12}
                strokeWidth={2}
                color={isActive ? "#f4eceb" : "#1c1b1b"}
                fill={isActive ? "#ffb2bc" : "none"}
              />
              <span
                className="truncate"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "7px",
                  color: isActive ? "#f4eceb" : "#1c1b1b",
                  letterSpacing: "0.03em",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── System tray ── */}
      <div
        className="shrink-0 self-stretch my-1 ml-1"
        style={{
          width: "2px",
          boxShadow: "inset 1px 0px 0px #7a4a52, inset -1px 0px 0px #f4eceb",
        }}
      />
      <TaskbarClock />
    </nav>
  );
}

// ─── Main desktop shell ─────────────────────────────────────────────

interface RetroDesktopProps {
  children: React.ReactNode;
}

export function RetroDesktop({ children }: RetroDesktopProps) {
  return (
    <>
      {/* Ambient layers — behind everything */}
      <div className="dot-grid" aria-hidden="true" />
      <div className="crt-overlay" aria-hidden="true" />

      <TopBar />

      {/* Desktop area between the two bars */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ paddingTop: "28px", paddingBottom: "44px", minHeight: "100dvh" }}
      >
        <div className="relative w-full overflow-hidden" style={{ maxWidth: "860px" }}>
          {/* Sweeping scanline beam */}
          <div className="scanline-beam" aria-hidden="true" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
