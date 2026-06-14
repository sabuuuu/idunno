import React, { useState } from "react";
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

const AUDIO_TRACKS = [
  { label: "Track 1", src: "music/1.mp3" },
  { label: "Track 2", src: "music/2.mp3" },
  { label: "Track 3", src: "music/3.mp3" },
  { label: "Track 4", src: "music/4.mp3" },
  { label: "None", src: null },
];

export function DisplayPropertiesWindow() {
  const { wallpaperSrc, setWallpaperSrc, bgAudioUrl, setBgAudioUrl, bgAudioVolume, setBgAudioVolume } = useWindowManager();
  const [activeTab, setActiveTab] = useState<"background" | "audio">("background");

  return (
    <div className="flex flex-col h-full bg-[#f4eceb] text-[#1c1b1b] p-2 font-sans text-sm">
      
      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#1c1b1b] mb-4">
        <button 
          className={`px-3 py-1 text-xs border border-b-0 border-[#1c1b1b] ${activeTab === "background" ? "bg-[#f4eceb] font-bold z-10 -mb-px pb-[5px]" : "bg-[#d4a0a8] mt-1"}`}
          onClick={() => setActiveTab("background")}
        >
          Background
        </button>
        <button 
          className={`px-3 py-1 text-xs border border-b-0 border-[#1c1b1b] ${activeTab === "audio" ? "bg-[#f4eceb] font-bold z-10 -mb-px pb-[5px]" : "bg-[#d4a0a8] mt-1"}`}
          onClick={() => setActiveTab("audio")}
        >
          Audio
        </button>
      </div>

      {activeTab === "background" && (
        <div className="flex flex-col gap-4 px-2">
          <div>
            <p className="text-xs mb-3 text-[#524345]">Select a background picture for your desktop.</p>
          </div>

          <div className="flex gap-4 h-48">
            {/* List of wallpapers */}
            <div
              className="w-1/2 overflow-y-auto border-2 border-[#8a4853] shadow-[inset_1px_1px_0px_#1c1b1b] bg-white"
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
                    <span className="text-[12px] font-['Space_Mono']">
                      {isSelected ? "▶" : " "}
                    </span>
                    {wp.label}
                  </button>
                );
              })}
            </div>

            {/* Preview monitor */}
            <div className="w-1/2 flex items-center justify-center flex-col gap-2">
              <div className="relative w-32 h-24 border-2 border-[#1c1b1b] bg-[#d4a0a8] flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                {wallpaperSrc ? (
                  <img src={wallpaperSrc} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-[#7a4a52] font-['Press_Start_2P']">
                    NONE
                  </span>
                )}
                {/* Fake inner CRT monitor frame */}
                <div className="absolute inset-0 border-4 border-[#f4eceb] mix-blend-overlay" />
              </div>
              <span className="text-[10px] text-[#8a4853] font-['Press_Start_2P']">
                PREVIEW
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "audio" && (
        <div className="flex flex-col gap-4 px-2">
          <div>
            <p className="text-xs mb-3 text-[#524345]">Select a background track for your desktop.</p>
          </div>

          <div className="flex gap-4 h-48">
            {/* List of audio tracks */}
            <div
              className="w-1/2 overflow-y-auto border-2 border-[#8a4853] shadow-[inset_1px_1px_0px_#1c1b1b] bg-white"
            >
              {AUDIO_TRACKS.map((track) => {
                const isSelected = bgAudioUrl === track.src;
                return (
                  <button
                    key={track.label}
                    className={`w-full text-left px-2 py-1 flex items-center gap-2`}
                    onClick={() => setBgAudioUrl(track.src)}
                    style={{
                      backgroundColor: isSelected ? "#8a4853" : "transparent",
                      color: isSelected ? "#ffffff" : "#1c1b1b",
                    }}
                  >
                    <span className="text-[12px] font-['Space_Mono']">
                      {isSelected ? "▶" : " "}
                    </span>
                    {track.label}
                  </button>
                );
              })}
            </div>

            {/* Preview player indicator and Volume */}
            <div className="w-1/2 flex items-center justify-center flex-col gap-4">
              <div className="relative w-32 h-20 border-2 border-[#1c1b1b] bg-[#d4a0a8] flex items-center justify-center overflow-hidden flex-col gap-2 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                {bgAudioUrl ? (
                  <>
                    <span className="text-2xl animate-pulse">🎵</span>
                    <span className="text-[8px] text-center px-1 break-words text-[#7a4a52] font-['Press_Start_2P'] animate-pulse">
                      PLAYING
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] text-[#7a4a52] font-['Press_Start_2P']">
                    SILENT
                  </span>
                )}
                <div className="absolute inset-0 border-4 border-[#f4eceb] mix-blend-overlay" />
              </div>

              {/* Volume Slider */}
              {bgAudioUrl && (
                <div className="w-32 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[8px] text-[#8a4853] font-['Press_Start_2P']">
                    <span>VOL</span>
                    <span>{Math.round(bgAudioVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={bgAudioVolume}
                    onChange={(e) => setBgAudioVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#d4a0a8] appearance-none cursor-pointer border border-[#1c1b1b] shadow-[inset_1px_1px_0px_#7a4a52]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
