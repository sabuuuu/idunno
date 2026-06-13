import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useWindowManager, WindowState } from "./useWindowManager";

interface WindowPortalProps {
  id: string;
  title: string;
  componentType: WindowState["componentType"];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  props?: any;
  children: React.ReactNode;
}

export function WindowPortal({ id, title, componentType, x = 50, y = 50, width = 400, height = 300, props, children }: WindowPortalProps) {
  const { windows, openWindow, closeWindow } = useWindowManager();
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Open the window if it's not already open
    openWindow({
      id,
      title,
      componentType,
      x,
      y,
      width,
      height,
      props,
    });
    setMounted(true);

    return () => {
      closeWindow(id);
    };
  }, [id, title, componentType, x, y, width, height, openWindow, closeWindow]);

  useEffect(() => {
    if (!mounted) return;
    
    const el = document.getElementById(`window-content-${id}`);
    if (el) {
      setContainer(el);
    } else {
      // It might take a tick for Desktop to render the window
      const timer = setTimeout(() => {
        setContainer(document.getElementById(`window-content-${id}`));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [mounted, id, windows]);

  if (!container) return null;

  return createPortal(children, container);
}
