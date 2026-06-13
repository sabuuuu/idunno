import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Clapperboard, Heart, Rss, Settings } from "lucide-react";
import { useWindowManager, WindowManagerProvider } from "./useWindowManager";
import { Window } from "./Window";
import { AestheticWindow } from "./AestheticWindow";

// ─── Top navbar — Win98 title bar style ────────────────────────────
function TopBar() {
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
      <div
        className="flex items-center gap-2 flex-1 min-w-0 h-[20px] px-2 select-none"
        style={{
          background: "linear-gradient(to right, #8a4853, #b76e79)",
          boxShadow: "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52",
        }}
      >
        <span style={{ fontSize: "12px", lineHeight: 1, color: "white" }} aria-hidden="true">♡</span>
        <span
          className="text-white leading-none truncate"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", fontWeight: 700, letterSpacing: "0.05em" }}
        >
          IDONNU.EXE
        </span>
      </div>
    </header>
  );
}

// ─── Bottom nav — Win98 taskbar style ──────────────────────────────
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
  const { windows, focusWindow, minimizeWindow } = useWindowManager();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-1 px-1"
      style={{
        height: "44px",
        backgroundColor: "#d4a0a8",
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
        <span style={{ fontSize: "14px", lineHeight: 1, color: "white" }}>♡</span>
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

      {/* ── Window Tabs ── */}
      <div className="flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto">
        {windows.map((win) => {
          const isActive = win.isFocused && !win.isMinimized;
          return (
            <button
              key={win.id}
              onClick={() => {
                if (isActive) {
                  minimizeWindow(win.id);
                } else {
                  focusWindow(win.id);
                }
              }}
              className="flex items-center gap-1.5 h-[26px] px-2 min-w-0 shrink-0 select-none"
              style={{
                backgroundColor: isActive ? "#b76e79" : "#c9858e",
                border: "1px solid #1c1b1b",
                boxShadow: isActive
                  ? "inset 1px 1px 0px #7a4a52, inset -1px -1px 0px #f4eceb, inset 2px 2px 0px #8a4853"
                  : "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52, inset 2px 2px 0px #d4a0a8, inset -2px -2px 0px #8a4853",
                maxWidth: "150px"
              }}
            >
              <span
                className="truncate"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "7px",
                  color: isActive ? "#f4eceb" : "#1c1b1b",
                  letterSpacing: "0.03em",
                }}
              >
                {win.title}
              </span>
            </button>
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

function DesktopContent({ children }: { children: React.ReactNode }) {
  const { windows, openWindow } = useWindowManager();
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    if (initialized) return;

    // Default aesthetic windows
    const saved = localStorage.getItem("desktop_windows");
    let hasAesthetic1 = false;
    let hasAesthetic2 = false;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        hasAesthetic1 = parsed.some((w: any) => w.id === "aesthetic-1");
        hasAesthetic2 = parsed.some((w: any) => w.id === "aesthetic-2");
      } catch (e) {
        // ignore
      }
    }

    if (!hasAesthetic1) {
      openWindow({
        id: "aesthetic-1",
        title: "CYBER.JPG",
        componentType: "aesthetic",
        x: 20,
        y: 40,
        width: 320,
        height: 260,
        props: { src: "/retro1.jpg" },
      });
    }

    if (!hasAesthetic2) {
      openWindow({
        id: "aesthetic-2",
        title: "SUNSET.GIF",
        componentType: "aesthetic",
        x: typeof window !== "undefined" ? window.innerWidth - 340 : 500,
        y: 100,
        width: 320,
        height: 260,
        props: { src: "/retro2.png" },
      });
    }
    setInitialized(true);
  }, [initialized, openWindow]);

  return (
    <>
      <div className="dot-grid" aria-hidden="true" />
      <div className="crt-overlay" aria-hidden="true" />

      <TopBar />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ paddingTop: "28px", paddingBottom: "44px" }}
      >
        <div className="scanline-beam" aria-hidden="true" />

        {/* Windows Rendering */}
        {windows.map((win) => (
          <Window key={win.id} window={win}>
            {win.componentType === "aesthetic" && (
              <AestheticWindow 
                src={win.id === "aesthetic-1" ? "/retro1.jpg" : win.id === "aesthetic-2" ? "/retro2.png" : win.props?.src} 
              />
            )}
            {/* The Window component renders #window-content-{win.id} where children are portaled */}
          </Window>
        ))}

        {/* Invisible container for route content. Children will portal themselves into windows */}
        <div style={{ display: "none" }}>{children}</div>
      </div>

      <BottomNav />
    </>
  );
}

export function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <WindowManagerProvider>
      <DesktopContent>{children}</DesktopContent>
    </WindowManagerProvider>
  );
}
