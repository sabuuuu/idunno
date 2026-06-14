"use client";

import { useEffect, useState } from "react";
import { WindowTitleBar } from "~/components/WindowTitleBar";

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
            backgroundColor: filled ? "var(--color-vapor-rose)" : "transparent",
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
    <div className="flex flex-col items-center gap-8 w-full max-w-md z-10">
      <span className="font-pixel text-xl tracking-widest text-vapor-rose">
        idonnu
      </span>

      <div
        className="w-full relative border-2 border-vapor-rose"
        style={{ boxShadow: "4px 4px 0px var(--color-vapor-rose)" }}
      >
        <WindowTitleBar label="loading.exe" />

        <div className="flex flex-col items-center gap-8 px-8 py-12 bg-vapor-cream">
          <PixelHourglass />

          <div className="text-center">
            <p className="font-retro text-5xl tracking-widest leading-none text-vapor-rose">
              PROCESSING...
            </p>
            <p className="mt-2 font-retro text-[22px] text-vapor-rose-dark">
              finding your perfect movie match
            </p>
          </div>

          <div className="w-full h-4 border-2 border-vapor-rose bg-vapor-cream">
            <div className="h-full" style={{ width: `${progress}%`, backgroundColor: "var(--color-vapor-rose)", transition: "width 0.8s ease" }} />
          </div>

          <div className="flex gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 border-2 border-vapor-rose transition-colors"
                style={{
                  backgroundColor: i < filledDots ? "var(--color-vapor-rose)" : "transparent",
                }}
              />
            ))}
          </div>

          <div className="w-full border border-vapor-pink bg-vapor-cream px-5 py-2.5">
            <p className="text-center font-pixel text-[8px] leading-loose text-vapor-rose-dark">
              {STATUS_MESSAGES[msgIndex]}
            </p>
          </div>
        </div>
      </div>

      <p className="font-retro text-xl text-vapor-rose-dark">
        please do not turn off your device ♡
      </p>
    </div>
  );
}
