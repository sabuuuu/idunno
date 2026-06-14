import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getFolderItemsServerFn } from "~/server/lists";
import { useWindowManager } from "~/components/desktop/useWindowManager";

interface FolderWindowProps {
  id: string;
  folderType?: "faves" | "watchlist" | "history";
}

export function FolderWindow({ id, folderType = "history" }: FolderWindowProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["folder-items", folderType],
    queryFn: () => getFolderItemsServerFn({ data: folderType }),
  });

  return (
    <div className="flex flex-col h-full bg-white text-[#1c1b1b]" onClick={() => setSelectedId(null)}>
      {/* Menu Bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-[#f4eceb] border-b border-[#1c1b1b] text-xs font-sans">
        <span className="cursor-pointer hover:bg-[#1c1b1b] hover:text-white px-1">File</span>
        <span className="cursor-pointer hover:bg-[#1c1b1b] hover:text-white px-1">Edit</span>
        <span className="cursor-pointer hover:bg-[#1c1b1b] hover:text-white px-1">View</span>
        <span className="cursor-pointer hover:bg-[#1c1b1b] hover:text-white px-1">Help</span>
      </div>
      
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 py-1 bg-[#f4eceb] border-b border-[#1c1b1b]">
        <button className="px-2 py-0.5 border border-[#1c1b1b] bg-[#d4a0a8] shadow-[inset_1px_1px_0_#f4eceb,inset_-1px_-1px_0_#7a4a52] active:shadow-[inset_1px_1px_0_#7a4a52,inset_-1px_-1px_0_#f4eceb] font-sans text-xs flex items-center gap-1">
          <span>⮜</span> Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto flex flex-wrap content-start gap-6">
        {isLoading ? (
          <div className="w-full text-center mt-10 text-[#7a4a52]" style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px" }}>
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div className="w-full text-center mt-10 text-[#7a4a52]" style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px" }}>
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
              <div className={`w-10 h-10 p-1 flex items-center justify-center ${selectedId === item.id ? "bg-[#000080]/30" : ""}`} style={{ imageRendering: "pixelated" }}>
                <span className="text-3xl">📄</span>
              </div>
              <span 
                className={`text-center px-1 leading-tight break-words w-full ${selectedId === item.id ? "bg-[#000080] text-white dotted-focus" : ""}`}
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}
              >
                {item.title}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Status Bar */}
      <div className="px-2 py-0.5 bg-[#f4eceb] border-t border-[#1c1b1b] flex items-center gap-4 text-[10px] font-sans text-[#524345]">
        <span>{items.length} object(s)</span>
      </div>
    </div>
  );
}
