import React, { useState } from "react";
import { useWindowManager } from "./useWindowManager";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

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
    <div className="flex flex-col h-full bg-vapor-cream text-vapor-dark p-2 font-sans text-sm">

      {/* Tabs */}
      <div className="flex gap-1 border-b border-vapor-dark mb-4">
        <Button
          variant="ghost"
          className={`h-auto rounded-none px-3 py-1 text-xs border border-b-0 border-vapor-dark hover:bg-vapor-cream ${activeTab === "background" ? "bg-vapor-cream font-bold z-10 -mb-px pb-[5px]" : "bg-vapor-pink mt-1"}`}
          onClick={() => setActiveTab("background")}
        >
          Background
        </Button>
        <Button
          variant="ghost"
          className={`h-auto rounded-none px-3 py-1 text-xs border border-b-0 border-vapor-dark hover:bg-vapor-cream ${activeTab === "audio" ? "bg-vapor-cream font-bold z-10 -mb-px pb-[5px]" : "bg-vapor-pink mt-1"}`}
          onClick={() => setActiveTab("audio")}
        >
          Audio
        </Button>
      </div>

      {activeTab === "background" && (
        <div className="flex flex-col gap-4 px-2">
          <div>
            <p className="text-xs mb-3 text-vapor-dark opacity-80">Select a background picture for your desktop.</p>
          </div>

          <div className="flex gap-4 h-48">
            {/* List of wallpapers */}
            <div className="w-1/2 overflow-y-auto border-2 border-vapor-rose-dark shadow-win98-in bg-white">
              {WALLPAPERS.map((wp) => {
                const isSelected = wallpaperSrc === wp.src;
                return (
                  <Button
                    key={wp.label}
                    variant="ghost"
                    className={`h-auto rounded-none justify-start w-full text-left px-2 py-1 flex items-center gap-2 hover:bg-vapor-rose-dark hover:text-white ${isSelected ? "bg-vapor-rose-dark text-white" : "bg-transparent text-vapor-dark"}`}
                    onClick={() => setWallpaperSrc(wp.src)}
                  >
                    <span className="text-xs font-mono">
                      {isSelected ? "▶" : " "}
                    </span>
                    {wp.label}
                  </Button>
                );
              })}
            </div>

            {/* Preview monitor */}
            <div className="w-1/2 flex items-center justify-center flex-col gap-2">
              <div className="relative w-32 h-24 border-2 border-vapor-dark bg-vapor-pink flex items-center justify-center overflow-hidden shadow-pixel">
                {wallpaperSrc ? (
                  <img src={wallpaperSrc} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xxs text-vapor-rose font-pixel">
                    NONE
                  </span>
                )}
                {/* Fake inner CRT monitor frame */}
                <div className="absolute inset-0 border-4 border-vapor-cream mix-blend-overlay" />
              </div>
              <span className="text-xxs text-vapor-rose-dark font-pixel">
                PREVIEW
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "audio" && (
        <div className="flex flex-col gap-4 px-2">
          <div>
            <p className="text-xs mb-3 text-vapor-dark opacity-80">Select a background track for your desktop.</p>
          </div>

          <div className="flex gap-4 h-48">
            {/* List of audio tracks */}
            <div className="w-1/2 overflow-y-auto border-2 border-vapor-rose-dark shadow-win98-in bg-white">
              {AUDIO_TRACKS.map((track) => {
                const isSelected = bgAudioUrl === track.src;
                return (
                  <Button
                    key={track.label}
                    variant="ghost"
                    className={`h-auto rounded-none justify-start w-full text-left px-2 py-1 flex items-center gap-2 hover:bg-vapor-rose-dark hover:text-white ${isSelected ? "bg-vapor-rose-dark text-white" : "bg-transparent text-vapor-dark"}`}
                    onClick={() => setBgAudioUrl(track.src)}
                  >
                    <span className="text-xs font-mono">
                      {isSelected ? "▶" : " "}
                    </span>
                    {track.label}
                  </Button>
                );
              })}
            </div>

            {/* Preview player indicator and Volume */}
            <div className="w-1/2 flex items-center justify-center flex-col gap-4">
              <div className="relative w-32 h-20 border-2 border-vapor-dark bg-vapor-pink flex items-center justify-center overflow-hidden flex-col gap-2 shadow-pixel">
                {bgAudioUrl ? (
                  <>
                    <span className="text-2xl animate-pulse">🎵</span>
                    <span className="text-xxs text-center px-1 wrap-break-word text-vapor-rose font-pixel animate-pulse">
                      PLAYING
                    </span>
                  </>
                ) : (
                  <span className="text-xxs text-vapor-rose font-pixel">
                    SILENT
                  </span>
                )}
                <div className="absolute inset-0 border-4 border-vapor-cream mix-blend-overlay" />
              </div>

              {/* Volume Slider */}
              {bgAudioUrl && (
                <div className="w-32 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[8px] text-vapor-rose-dark font-pixel">
                    <span>VOL</span>
                    <span>{Math.round(bgAudioVolume * 100)}%</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={bgAudioVolume}
                    onChange={(e) => setBgAudioVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-vapor-pink appearance-none cursor-pointer border border-vapor-dark shadow-win98-in p-0 rounded-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-vapor-cream [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-vapor-dark"
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
