import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useWindowManager, WindowManagerProvider, type WindowState } from "./useWindowManager";
import { Window } from "./Window";
import { AestheticWindow } from "./AestheticWindow";
import { DesktopIcon } from "./DesktopIcon";
import { FolderWindow } from "~/features/desktop-apps/FolderWindow";
import { LoginWindow } from "~/features/desktop-apps/LoginWindow";
import { LogoutWindow } from "~/features/desktop-apps/LogoutWindow";
import { getSessionUserServerFn } from "~/server/auth";
import { useQuery } from "@tanstack/react-query";
import { DisplayPropertiesWindow } from "./DisplayPropertiesWindow";

function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-1 gap-2 h-[28px] bg-vapor-pink shadow-win98-out">
      <div
        className="flex items-center gap-2 flex-1 min-w-0 h-5 px-2 select-none shadow-win98-active bg-linear-to-r from-vapor-rose-dark to-vapor-rose"
      >
        <span className="text-xs leading-none text-white" aria-hidden="true">♡</span>
        <span className="text-white leading-none truncate font-pixel text-[8px] font-bold tracking-wider">
          IDONNU.EXE
        </span>
      </div>

      <div className="flex gap-1 ml-2 mr-auto font-pixel">
        <Button variant="vapor" className="h-5 text-micro text-vapor-dark cursor-pointer px-1.5 bg-vapor-muted shadow-win98-out">File</Button>
        <Button variant="vapor" className="h-5 text-micro text-vapor-dark cursor-pointer px-1.5 bg-vapor-muted shadow-win98-out">Edit</Button>
        <Button variant="vapor" className="h-5 text-micro text-vapor-dark cursor-pointer px-1.5 bg-vapor-muted shadow-win98-out">View</Button>
        <Button variant="vapor" className="h-5 text-micro text-vapor-dark cursor-pointer px-1.5 bg-vapor-muted shadow-win98-out">Help</Button>
      </div>
    </header>
  );
}

function TaskbarClock() {
  const [time, setTime] = React.useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  );

  React.useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 10_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="flex items-center justify-center px-3 h-full shrink-0 min-w-[60px] shadow-win98-in"
    >
      <span className="font-pixel text-[8px] text-vapor-dark tracking-wider">
        {time}
      </span>
    </div>
  );
}

function BottomNav() {
  const { windows, focusWindow, minimizeWindow, openWindow } = useWindowManager();
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["session-user"],
    queryFn: () => getSessionUserServerFn(),
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-1 px-1 h-[44px] bg-vapor-pink shadow-win98-out">
      <Button
        variant="vapor"
        className="flex items-center gap-1.5 shrink-0 h-6 px-2 bg-vapor-rose"
        onClick={() => { navigate({ to: "/ask" }); }}
      >
        <span className="text-sm leading-none text-white">♡</span>
        <span className="font-pixel text-[8px] text-vapor-cream font-bold tracking-wider">
          START
        </span>
      </Button>
      <div
        className="shrink-0 self-stretch my-1 w-[2px] shadow-[inset_1px_0_0_var(--color-vapor-rose-dark),inset_-1px_0_0_var(--color-vapor-cream)]"
      />
      <div className="flex items-center gap-1 px-1 shrink-0">
        <Button
          variant="vapor"
          onClick={() => {
            openWindow({
              id: "display-properties",
              title: "DISPLAY.EXE",
              componentType: "display",
              x: typeof window !== "undefined" ? window.innerWidth / 2 - 200 : 200,
              y: typeof window !== "undefined" ? window.innerHeight / 2 - 175 : 100,
              width: 400,
              height: 350,
            });
          }}
          className="w-6 h-6 flex items-center justify-center p-0 bg-vapor-muted"
          title="Display Properties"
        >
          <Settings size={12} className="text-vapor-dark" />
        </Button>
        {user && (
          <Button
            variant="vapor"
            onClick={() => {
              openWindow({
                id: "logout-window",
                title: "LOGOUT.EXE",
                componentType: "logout",
                x: typeof window !== "undefined" ? window.innerWidth / 2 - 175 : 200,
                y: typeof window !== "undefined" ? window.innerHeight / 2 - 150 : 200,
                width: 350,
                height: 250,
              });
            }}
            className="w-6 h-6 flex items-center justify-center p-0 bg-vapor-muted"
            title="Log Out"
          >
            <img src="/profile.png" className="w-5 h-5 [image-rendering:pixelated]" alt="User Profile" />
          </Button>
        )}
      </div>
      <div
        className="shrink-0 self-stretch my-1 w-[2px] shadow-[inset_1px_0_0_var(--color-vapor-rose-dark),inset_-1px_0_0_var(--color-vapor-cream)]"
      />
      <div className="flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto">
        {windows.filter((w) => w.componentType !== "aesthetic").map((win) => {
          const isActive = win.isFocused && !win.isMinimized;
          return (
            <Button
              key={win.id}
              variant="vapor"
              onClick={() => {
                if (isActive) {
                  minimizeWindow(win.id);
                } else {
                  focusWindow(win.id);
                }
              }}
              className={`flex items-center gap-1.5 h-[26px] px-2 min-w-0 shrink-0 max-w-[150px] ${isActive ? 'bg-vapor-rose shadow-win98-active' : 'bg-vapor-muted shadow-win98-out'}`}
            >
              <span className={`truncate font-pixel text-micro tracking-wide ${isActive ? 'text-vapor-cream' : 'text-vapor-dark'}`}>
                {win.title}
              </span>
            </Button>
          );
        })}
      </div>
      <div
        className="shrink-0 self-stretch my-1 ml-1 w-[2px] shadow-[inset_1px_0_0_var(--color-vapor-rose-dark),inset_-1px_0_0_var(--color-vapor-cream)]"
      />
      <TaskbarClock />
    </nav>
  );
}

function DesktopContent({ children }: { children: React.ReactNode }) {
  const { windows, openWindow, wallpaperSrc, bgAudioUrl, bgAudioVolume } = useWindowManager();
  const [initialized, setInitialized] = React.useState(false);

  const { data: user } = useQuery({
    queryKey: ["session-user"],
    queryFn: () => getSessionUserServerFn(),
  });

  React.useEffect(() => {
    if (initialized) return;

    // Default aesthetic windows
    const saved = localStorage.getItem("desktop_windows");
    let hasAesthetic1 = false;
    let hasAesthetic2 = false;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        hasAesthetic1 = parsed.some((w: WindowState) => w.id === "aesthetic-1");
        hasAesthetic2 = parsed.some((w: WindowState) => w.id === "aesthetic-2");
      } catch {
        // ignore
      }
    }

    if (!hasAesthetic1) {
      openWindow({
        id: "aesthetic-1",
        title: "SUNSET.GIF",
        componentType: "aesthetic",
        x: 100,
        y: 40,
        width: 320,
        height: 260,
        props: { src: "/images/retro2.jpg" },
      });
    }

    if (!hasAesthetic2) {
      openWindow({
        id: "aesthetic-2",
        title: "KITTY.JPG",
        componentType: "aesthetic",
        x: typeof window !== "undefined" ? window.innerWidth - 340 : 500,
        y: 400,
        width: 260,
        height: 220,
        props: { src: "/images/retro1.png" },
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialized(true);
  }, [initialized, openWindow]);

  return (
    <>
      <div className="dot-grid" aria-hidden="true" />
      {wallpaperSrc && (
        <img
          src={wallpaperSrc}
          alt="Desktop Wallpaper"
          className="absolute inset-0 w-full h-full object-fill z-0"
        />
      )}
      <div className="crt-overlay" aria-hidden="true" />
      {bgAudioUrl && (
        <audio
          id="desktop-bg-audio"
          src={`/${bgAudioUrl}`}
          autoPlay
          loop
          ref={(el) => { if (el) el.volume = bgAudioVolume; }}
        />
      )}

      <TopBar />

      <div
        className="absolute inset-0 overflow-hidden pt-[28px] pb-[44px]"
      >
        <div className="scanline-beam" aria-hidden="true" />

        {/* Desktop Icons */}
        <DesktopIcon id="icon-faves" label="FAVES.DIR" iconSrc="/folder.png" defaultX={20} defaultY={20} onDoubleClick={() => openWindow({ id: "faves-folder", title: "FAVES.DIR", componentType: "folder", x: 100, y: 100, width: 400, height: 400, props: { folderType: "faves" } })} />
        <DesktopIcon id="icon-watchlist" label="WATCHLIST.DIR" iconSrc="/folder.png" defaultX={20} defaultY={100} onDoubleClick={() => openWindow({ id: "watchlist-folder", title: "WATCHLIST.DIR", componentType: "folder", x: 150, y: 150, width: 400, height: 400, props: { folderType: "watchlist" } })} />
        <DesktopIcon id="icon-history" label="HISTORY.DIR" iconSrc="/folder.png" defaultX={20} defaultY={180} onDoubleClick={() => openWindow({ id: "history-folder", title: "HISTORY.DIR", componentType: "folder", x: 200, y: 200, width: 400, height: 300, props: { folderType: "history" } })} />

        {/* Windows Rendering */}
        {windows.map((win) => (
          <Window key={win.id} window={win}>
            {win.componentType === "aesthetic" && (
              <AestheticWindow
                src={win.id === "aesthetic-1" ? "/images/retro1.png" : win.id === "aesthetic-2" ? "/images/retro2.jpg" : (win.props?.src as string) || ""}
              />
            )}
            {win.componentType === "display" && <DisplayPropertiesWindow />}
            {win.componentType === "login" && <LoginWindow />}
            {win.componentType === "logout" && <LogoutWindow />}
            {win.componentType === "folder" && <FolderWindow id={win.id} folderType={win.props?.folderType as "history" | "faves" | "watchlist" | undefined} />}
          </Window>
        ))}

        <div className="hidden">{children}</div>
      </div>

      <BottomNav />
    </>
  );
}

export function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <WindowManagerProvider>
      <DesktopContent>{children}</DesktopContent>
    </WindowManagerProvider>
  );
}
