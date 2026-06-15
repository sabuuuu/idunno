import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getFolderItemsServerFn } from "~/server/lists";
import { getSessionUserServerFn } from "~/server/auth";
import { useWindowManager } from "~/components/desktop/useWindowManager";
import { Button } from "~/components/ui/button";
interface FolderWindowProps {
  id: string;
  folderType?: "faves" | "watchlist" | "history";
}

export function FolderWindow({ id: _id, folderType = "history" }: FolderWindowProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [localHistory, setLocalHistory] = React.useState<any[]>([]);
  const { openWindow } = useWindowManager();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["session-user"],
    queryFn: () => getSessionUserServerFn(),
  });

  const { data: dbItems = [], isLoading: isItemsLoading } = useQuery({
    queryKey: ["folder-items", folderType],
    queryFn: () => getFolderItemsServerFn({ data: folderType }),
    enabled: !!user,
  });

  React.useEffect(() => {
    if (folderType === "history") {
      try {
        setLocalHistory(JSON.parse(localStorage.getItem("idunno_history") || "[]"));
      } catch (e) {}
    }
  }, [folderType]);

  const items = user ? dbItems : (folderType === "history" ? localHistory : []);
  const isLoading = isUserLoading || (user ? isItemsLoading : false);

  const needsLogin = !user && !isUserLoading && (folderType === "faves" || folderType === "watchlist");

  return (
    <div className="flex flex-col h-full bg-white text-vapor-dark" onClick={() => setSelectedId(null)}>
      <div className="flex items-center gap-4 px-2 py-1 bg-vapor-cream border-b border-vapor-dark text-xs font-sans">
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">File</span>
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">Edit</span>
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">View</span>
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">Help</span>
      </div>

      <div className="flex-1 p-4 overflow-auto flex flex-wrap content-start gap-6">
        {isLoading ? (
          <div className="w-full text-center mt-10 text-vapor-rose-dark font-mono text-xs">
            Loading...
          </div>
        ) : needsLogin ? (
          <div className="w-full flex flex-col items-center justify-center gap-4 text-center mt-10 p-4">
            <div className="text-4xl grayscale opacity-70">🔒</div>
            <div className="font-pixel text-xs text-vapor-rose-dark leading-relaxed">
              Please log in to view your {folderType}.
            </div>
            <Button variant="vapor" className="font-pixel text-micro tracking-wide" onClick={() => openWindow({ id: "login-window", title: "LOGIN.EXE", componentType: "login", x: typeof window !== "undefined" ? window.innerWidth / 2 - 175 : 200, y: typeof window !== "undefined" ? window.innerHeight / 2 - 150 : 200, width: 350, height: 300 })}>
              LOGIN.EXE
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="w-full text-center mt-10 text-vapor-rose-dark font-mono text-xs">
            This folder is empty.
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-1 cursor-pointer w-20"
              onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (item.resultImdbId) {
                  window.open(`https://www.imdb.com/title/${item.resultImdbId}`, "_blank");
                }
              }}
            >
              <div className={`w-10 h-10 p-1 flex items-center justify-center [image-rendering:pixelated] ${selectedId === item.id ? "bg-win98-blue/30" : ""}`}>
                <span className="text-3xl">📄</span>
              </div>
              <span className={`text-center px-1 leading-tight wrap-break-word w-full font-mono text-[11px] ${selectedId === item.id ? "bg-win98-blue text-white dotted-focus" : ""}`}>
                {item.title}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="px-2 py-0.5 bg-vapor-cream border-t border-vapor-dark flex items-center gap-4 text-xs font-sans text-vapor-dark opacity-80">
        <span>{items.length} object(s)</span>
      </div>
    </div>
  );
}
