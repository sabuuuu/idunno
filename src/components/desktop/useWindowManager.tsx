import * as React from "react";
import { useState, useCallback, useEffect } from "react";

export interface WindowState {
  id: string;
  title: string;
  componentType: "ask" | "result" | "aesthetic" | "generic";
  props?: any;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
}

export type WindowManagerAPI = {
  windows: WindowState[];
  openWindow: (windowConfig: Omit<WindowState, "id" | "zIndex" | "isFocused" | "isMinimized" | "isMaximized"> & { id?: string }) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
};

const WindowManagerContext = React.createContext<WindowManagerAPI | null>(null);

export function useWindowManager() {
  const context = React.useContext(WindowManagerContext);
  if (!context) {
    throw new Error("useWindowManager must be used within a WindowManagerProvider");
  }
  return context;
}

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [topZIndex, setTopZIndex] = useState(10);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("desktop_windows");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Reset focus on reload
        const unfocused = parsed.map((w: WindowState) => ({ ...w, isFocused: false }));
        setWindows(unfocused);
        
        // Find highest zIndex to resume
        let maxZ = 10;
        for (const w of parsed) {
          if (w.zIndex > maxZ) maxZ = w.zIndex;
        }
        setTopZIndex(maxZ);
      }
    } catch (e) {
      console.error("Failed to load window state", e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("desktop_windows", JSON.stringify(windows));
    }
  }, [windows, isInitialized]);

  const openWindow = useCallback(
    (
      windowConfig: Omit<WindowState, "id" | "zIndex" | "isFocused" | "isMinimized" | "isMaximized"> & {
        id?: string;
      }
    ) => {
      setTopZIndex((prevTop) => {
        const newZIndex = prevTop + 1;
        setWindows((prev) => {
          const existingIndex = prev.findIndex((w) => w.id === windowConfig.id);
          if (existingIndex >= 0) {
            // Restore and focus existing
            const next = [...prev];
            next[existingIndex] = { ...next[existingIndex], isMinimized: false, isFocused: true, zIndex: newZIndex };
            return next.map((w, i) => (i === existingIndex ? w : { ...w, isFocused: false }));
          }

          // Create new
          const newId = windowConfig.id || `win-${Date.now()}`;
          const newWin: WindowState = {
            ...windowConfig,
            id: newId,
            zIndex: newZIndex,
            isMinimized: false,
            isMaximized: false,
            isFocused: true,
          };
          const next = prev.map((w) => ({ ...w, isFocused: false }));
          return [...next, newWin];
        });
        return newZIndex;
      });
    },
    []
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setTopZIndex((prevTop) => {
      const newZIndex = prevTop + 1;
      setWindows((prev) => {
        return prev.map((w) => {
          if (w.id === id) {
            return { ...w, isFocused: true, zIndex: newZIndex, isMinimized: false };
          }
          return { ...w, isFocused: false };
        });
      });
      return newZIndex;
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true, isFocused: false } : w)));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)));
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, width, height } : w)));
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        toggleMaximize,
        updateWindowPosition,
        updateWindowSize,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}
