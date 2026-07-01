import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getResult } from "~/features/recommendation/server/result";
import { ResultCard } from "./result-card";
import { Loader2 } from "lucide-react";

interface ResultDetailWindowProps {
  id: string;
  sessionId: string;
}

export function ResultDetailWindow({ id: _id, sessionId }: ResultDetailWindowProps) {
  const { data: result, isLoading, error } = useQuery({
    queryKey: ["result-detail", sessionId],
    queryFn: () => getResult({ data: sessionId }),
  });

  return (
    <div className="flex flex-col h-full bg-white text-vapor-dark font-sans text-xs select-none">
      {/* Menu bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-vapor-cream border-b border-vapor-dark text-xs font-sans">
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">File</span>
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">Edit</span>
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">View</span>
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">Help</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto select-text">
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-vapor-rose-dark select-none">
            <Loader2 className="animate-spin" size={24} />
            <span className="font-pixel text-micro uppercase tracking-wider">
              Retrieving database logs...
            </span>
          </div>
        )}

        {error && (
          <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center select-none">
            <div className="text-4xl grayscale opacity-70 mb-2">❌</div>
            <div className="font-pixel text-xs text-red-500 leading-relaxed max-w-xs">
              FATAL ERROR: {error instanceof Error ? error.message : "Failed to load pick."}
            </div>
          </div>
        )}

        {result && (
          <div className="p-4 flex justify-center w-full">
            <ResultCard result={result} sessionId={sessionId} />
          </div>
        )}
      </div>
    </div>
  );
}
