import React, { useState, useRef, useEffect } from "react";

interface DesktopIconProps {
  id: string;
  label: string;
  iconSrc: string;
  defaultX: number;
  defaultY: number;
  onDoubleClick: () => void;
}

export function DesktopIcon({ id, label, iconSrc, defaultX, defaultY, onDoubleClick }: DesktopIconProps) {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [isDragging, setIsDragging] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved position
    const saved = localStorage.getItem(`icon_pos_${id}`);
    if (saved) {
      try {
        setPosition(JSON.parse(saved));
      } catch (e) { }
    }
  }, [id]);

  useEffect(() => {
    if (!isDragging) return;

    document.body.style.userSelect = "none";

    const handleMouseMove = (e: MouseEvent) => {
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // Keep within bounds
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem(`icon_pos_${id}`, JSON.stringify(position));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, id, position]);

  // Click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (iconRef.current && !iconRef.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={iconRef}
      className="absolute flex flex-col items-center gap-1 cursor-pointer"
      style={{
        left: position.x,
        top: position.y,
        width: "64px",
      }}
      onMouseDown={(e) => {
        setIsSelected(true);
        setIsDragging(true);
        const rect = iconRef.current!.getBoundingClientRect();
        setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
    >
      <div
        className={`size-16 p-1.5 flex items-center justify-center ${isSelected ? "bg-[#000080]/30" : ""}`}
        style={{ imageRendering: "pixelated" }}
      >
        <img
          src={iconSrc}
          alt={label}
          className="w-full h-full object-contain pointer-events-none"
          style={{ filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.5))" }}
        />
      </div>
      <span
        className={`text-center px-1 leading-tight wrap-break-word ${isSelected ? "bg-[#000080] text-white dotted-focus" : "text-white drop-shadow-md"}`}
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          textShadow: isSelected ? "none" : "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
        }}
      >
        {label}
      </span>
    </div>
  );
}
