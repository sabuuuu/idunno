import React from "react";
import { useWindowManager } from "./useWindowManager";

const WALLPAPERS = [
  { label: "None (Solid Color)", src: null },
  { label: "Wallpaper 1", src: "/wallpapers/wallpaper-1.jpg" },
  { label: "Wallpaper 2", src: "/wallpapers/wallpaper-2.jpg" },
  { label: "Wallpaper 3", src: "/wallpapers/wallpaper-3.png" },
  { label: "Wallpaper 4", src: "/wallpapers/wallpaper-4.png" },
  { label: "Wallpaper 5", src: "/wallpapers/wallpaper-5.jpg" },
  { label: "Wallpaper 6", src: "/wallpapers/wallpaper-6.jpg" },
];

export function DisplayPropertiesWindow() {
  const { wallpaperSrc, setWallpaperSrc } = useWindowManager();

  return (
    <div className="flex flex-col h-full bg-[#f4eceb] text-[#1c1b1b] p-4 font-sans text-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-bold mb-1" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#8a4853" }}>
            BACKGROUND
          </h2>
          <p className="text-xs mb-3 text-[#524345]">Select a background picture for your desktop.</p>
        </div>

        <div className="flex gap-4 h-48">
          {/* List of wallpapers */}
          <div
            className="w-1/2 overflow-y-auto border-2 bg-white"
            style={{ borderColor: "#8a4853", boxShadow: "inset 1px 1px 0px #1c1b1b" }}
          >
            {WALLPAPERS.map((wp) => {
              const isSelected = wallpaperSrc === wp.src;
              return (
                <button
                  key={wp.label}
                  className={`w-full text-left px-2 py-1 flex items-center gap-2`}
                  onClick={() => setWallpaperSrc(wp.src)}
                  style={{
                    backgroundColor: isSelected ? "#8a4853" : "transparent",
                    color: isSelected ? "#ffffff" : "#1c1b1b",
                  }}
                >
                  <span style={{ fontSize: "12px", fontFamily: "'Space Mono', monospace" }}>
                    {isSelected ? "▶" : " "}
                  </span>
                  {wp.label}
                </button>
              );
            })}
          </div>

          {/* Preview monitor */}
          <div className="w-1/2 flex items-center justify-center flex-col gap-2">
            <div
              className="relative w-32 h-24 border-2 bg-[#d4a0a8] flex items-center justify-center overflow-hidden"
              style={{ borderColor: "#1c1b1b", boxShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}
            >
              {wallpaperSrc ? (
                <img src={wallpaperSrc} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px]" style={{ fontFamily: "'Press Start 2P', monospace", color: "#7a4a52" }}>
                  NONE
                </span>
              )}
              {/* Fake inner CRT monitor frame */}
              <div className="absolute inset-0 border-4" style={{ borderColor: "#f4eceb", mixBlendMode: "overlay" }} />
            </div>
            <span style={{ fontSize: "10px", fontFamily: "'Press Start 2P', monospace", color: "#8a4853" }}>
              PREVIEW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
