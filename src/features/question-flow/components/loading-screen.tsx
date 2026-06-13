"use client";

import { useEffect, useState } from "react";
import { WindowTitleBar } from "~/components/WindowTitleBar";

// ── Pixel hourglass sprite (16×16 grid of 4px cells) ──────────────
// 1 = filled (#b76e79), 0 = transparent
const HOURGLASS: number[] = [
  0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
  0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
  0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,
  0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
  0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
  0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
  0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,
  0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,
  0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,
  0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,
  0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
  0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
  0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
  0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
];

function PixelHourglass() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(16, 4px)",
        width: "64px",
        height: "64px",
      }}
      aria-hidden="true"
    >
      {HOURGLASS.map((filled, i) => (
        <div
          key={i}
          style={{
            width: "4px",
            height: "4px",
            backgroundColor: filled ? "#b76e79" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

const STATUS_MESSAGES = [
  "analyzing your taste profile...",
  "consulting the oracle...",
  "scanning the archives...",
  "calibrating recommendation engine...",
  "almost there...",
];

export function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const t = setInterval(() => setMsgIndex((i) => (i + 1) % STATUS_MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setProgress((p) => Math.min(p + 8, 90)), 900);
    return () => clearInterval(t);
  }, []);

  const filledDots = Math.max(1, Math.round((progress / 90) * 5));

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[480px] z-10">
      {/* Wordmark */}
      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "20px", letterSpacing: "0.1em", color: "#b76e79" }}>
        idonnu
      </span>

      {/* Window */}
      <div
        className="w-full relative"
        style={{ border: "2px solid #b76e79", boxShadow: "4px 4px 0px #b76e79" }}
      >
        <WindowTitleBar label="loading.exe" />

        <div className="flex flex-col items-center gap-8 px-8 py-12" style={{ backgroundColor: "#f4eceb" }}>
          <PixelHourglass />

          <div className="text-center">
            <p style={{ fontFamily: "'VT323', monospace", fontSize: "48px", letterSpacing: "0.1em", lineHeight: 1, color: "#b76e79" }}>
              PROCESSING...
            </p>
            <p className="mt-2" style={{ fontFamily: "'VT323', monospace", fontSize: "22px", color: "#7a4a52" }}>
              finding your perfect movie match
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full" style={{ border: "2px solid #b76e79", height: "16px", backgroundColor: "#f4eceb" }}>
            <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "#b76e79", transition: "width 0.8s ease" }} />
          </div>

          {/* Status dots */}
          <div className="flex gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: i < filledDots ? "#b76e79" : "transparent",
                  border: "2px solid #b76e79",
                  transition: "background-color 0.3s",
                }}
              />
            ))}
          </div>

          {/* Cycling log line */}
          <div className="w-full" style={{ border: "1px solid #d4a0a8", backgroundColor: "#ede0df", padding: "10px 20px" }}>
            <p className="text-center" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", lineHeight: 2, color: "#7a4a52" }}>
              {STATUS_MESSAGES[msgIndex]}
            </p>
          </div>
        </div>
      </div>

      <p style={{ fontFamily: "'VT323', monospace", fontSize: "20px", color: "#7a4a52" }}>
        please do not turn off your device ♡
      </p>
    </div>
  );
}
