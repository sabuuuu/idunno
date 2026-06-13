import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

// ─── Top navbar (Dashboard 1 style) ────────────────────────────────

function TopBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3"
      style={{
        height: "28px",
        backgroundColor: "#8a4853",
        borderBottom: "2px solid #1c1b1b",
      }}
    >
      {/* App name */}
      <span
        className="text-white uppercase tracking-tighter leading-none select-none"
        style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", fontWeight: 700 }}
      >
        IDONNU
      </span>

      {/* Window chrome buttons */}
      <div className="flex items-center gap-1.5">
        <button
          aria-label="Minimise"
          className="w-3.5 h-3.5 flex items-center justify-center border border-white/40 text-white/80 hover:bg-white/20 transition-colors"
          style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace" }}
        >
          —
        </button>
        <button
          aria-label="Maximise"
          className="w-3.5 h-3.5 flex items-center justify-center border border-white/40 text-white/80 hover:bg-white/20 transition-colors"
          style={{ fontSize: "8px", fontFamily: "'Space Mono', monospace" }}
        >
          □
        </button>
        <button
          aria-label="Close"
          className="w-3.5 h-3.5 flex items-center justify-center border border-white/40 text-white/80 hover:bg-white/20 transition-colors"
          style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace" }}
        >
          ✕
        </button>
      </div>
    </header>
  );
}

// ─── Bottom nav (Dashboard 2 style) ────────────────────────────────

const NAV_ITEMS: Array<{ label: string; icon: string; to: "/ask" | "/" }> = [
  { label: "QUEST",  icon: "◈", to: "/ask" },
  { label: "FAVES",  icon: "♥", to: "/"    },
  { label: "FEED",   icon: "≋", to: "/"    },
  { label: "SETUP",  icon: "⚙", to: "/"    },
];

function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center"
      style={{
        height: "60px",
        backgroundColor: "#F4ECEB",
        borderTop: "2px solid #1c1b1b",
        boxShadow: "0px -4px 0px #B76E79",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname.startsWith(item.to) && item.to !== "/";
        return (
          <Link
            key={item.label}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-colors select-none",
              isActive
                ? "text-white"
                : "text-[#524345] hover:text-[#8a4853]",
            )}
            style={
              isActive
                ? {
                    backgroundColor: "#8a4853",
                    border: "2px solid #1c1b1b",
                    transform: "translateY(-4px)",
                    boxShadow: "4px 4px 0px #1c1b1b",
                  }
                : undefined
            }
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>{item.icon}</span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
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
        style={{ paddingTop: "28px", paddingBottom: "60px", minHeight: "100dvh" }}
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
