import React, { useRef, useState, useEffect } from "react";
import { useWindowManager, WindowState } from "./useWindowManager";

export function Window({ window: win, children }: { window: WindowState; children: React.ReactNode }) {
  const { focusWindow, closeWindow, toggleMaximize, minimizeWindow, updateWindowPosition, updateWindowSize } = useWindowManager();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDragging) return;

    document.body.style.userSelect = "none";

    const handleMouseMove = (e: MouseEvent) => {
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;
      
      // Bounds checking (prevent window from getting completely lost)
      newY = Math.max(0, newY); 

      updateWindowPosition(win.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, win.id, updateWindowPosition]);

  useEffect(() => {
    if (!isResizing) return;

    document.body.style.userSelect = "none";

    const handleMouseMove = (e: MouseEvent) => {
      if (!windowRef.current) return;
      const rect = windowRef.current.getBoundingClientRect();
      const newWidth = Math.max(200, e.clientX - rect.left);
      const newHeight = Math.max(100, e.clientY - rect.top);

      updateWindowSize(win.id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, win.id, updateWindowSize]);

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { top: 0, left: 0, width: "100%", height: "calc(100% - 44px)", zIndex: win.zIndex } // space for taskbar
    : { top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  const CHROME_ACTIONS = [
    { label: "Minimise", glyph: "—", fontSize: "10px", onClick: () => minimizeWindow(win.id) },
    { label: "Maximise", glyph: "□", fontSize: "9px", onClick: () => toggleMaximize(win.id) },
    { label: "Close", glyph: "✕", fontSize: "9px", onClick: () => closeWindow(win.id) },
  ];

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col`}
      style={{
        ...style,
        backgroundColor: "#d4a0a8",
        boxShadow: "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52, 2px 2px 10px rgba(0,0,0,0.5)",
        border: "1px solid #1c1b1b",
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title Bar */}
      <header
        className="flex items-center justify-between px-1 gap-2 m-0.5"
        style={{
          height: "22px",
          backgroundColor: win.isFocused ? undefined : "#c9858e", // unfocused background
          background: win.isFocused ? "linear-gradient(to right, #8a4853, #b76e79)" : undefined,
          boxShadow: win.isFocused ? "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52" : "inset 1px 1px 0px #e0aeb6, inset -1px -1px 0px #7a4a52",
        }}
        onMouseDown={(e) => {
          if (win.isMaximized) return; // Don't drag if maximized
          setIsDragging(true);
          const rect = windowRef.current!.getBoundingClientRect();
          setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0 px-2 select-none">
          <span style={{ fontSize: "10px", lineHeight: 1, color: win.isFocused ? "#fff" : "#1c1b1b" }} aria-hidden="true">♡</span>
          <span
            className="leading-none truncate"
            style={{ 
              fontFamily: "'Press Start 2P', monospace", 
              fontSize: "8px", 
              fontWeight: 700, 
              letterSpacing: "0.05em",
              color: win.isFocused ? "#ffffff" : "#1c1b1b"
            }}
          >
            {win.title}
          </span>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-0.5 shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          {CHROME_ACTIONS.map(({ label, glyph, fontSize, onClick }) => (
            <button
              key={label}
              aria-label={label}
              onClick={onClick}
              className="flex items-center justify-center"
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: "#d4a0a8",
                border: "1px solid #1c1b1b",
                boxShadow: "inset 1px 1px 0px #f4eceb, inset -1px -1px 0px #7a4a52, inset 2px 2px 0px #d4a0a8, inset -2px -2px 0px #8a4853",
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

      {/* Content */}
      <div 
        id={`window-content-${win.id}`}
        className="flex-1 overflow-auto bg-[#f4eceb] border m-0.5 relative"
        style={{
          boxShadow: "inset 1px 1px 0px #7a4a52, inset -1px -1px 0px #ffffff",
          borderColor: "#1c1b1b"
        }}
      >
        {children}
      </div>

      {/* Resize Handle */}
      {!win.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize flex items-end justify-end p-0.5"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsResizing(true);
            focusWindow(win.id);
          }}
        >
          <div className="w-2 h-2" style={{
            background: `linear-gradient(135deg, transparent 50%, #8a4853 50%)`
          }} />
        </div>
      )}
    </div>
  );
}
