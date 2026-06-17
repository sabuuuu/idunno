import React, { useEffect } from "react";
import { useConvinceMe } from "~/features/recommendation/hooks/use-convince-me";
import { Loader2, FileText } from "lucide-react";

interface ConvinceWindowProps {
  id: string;
  sessionId: string;
}

export function ConvinceWindow({ id: _id, sessionId }: ConvinceWindowProps) {
  const { mutate: getPitch, data, isPending, error } = useConvinceMe();

  useEffect(() => {
    getPitch(sessionId);
  }, [sessionId, getPitch]);

  return (
    <div className="flex flex-col h-full bg-white text-vapor-dark font-mono text-xs select-none">
      {/* Notepad style menu bar */}
      <div className="flex items-center gap-4 px-3 py-1 bg-vapor-cream border-b border-vapor-dark text-xxs font-sans">
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">File</span>
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">Edit</span>
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">Search</span>
        <span className="cursor-pointer hover:bg-vapor-dark hover:text-white px-1">Help</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto select-text leading-relaxed">
        {isPending && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-vapor-rose-dark select-none">
            <Loader2 className="animate-spin" size={24} />
            <span className="font-pixel text-micro uppercase tracking-wider">
              Running persuasion subroutines...
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 border-2 border-dashed border-red-500 bg-red-50 text-red-700 font-sans text-xs">
            <p className="font-bold mb-1">Execution Error</p>
            <p>{error.message || "Failed to load persuasion logs."}</p>
          </div>
        )}

        {data?.pitch && (
          <div className="flex gap-3 items-start select-all whitespace-pre-wrap">
            <FileText size={16} className="text-vapor-rose-dark shrink-0 mt-0.5" />
            <p className="italic">"{data.pitch}"</p>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3 py-0.5 bg-vapor-cream border-t border-vapor-dark flex items-center justify-between text-xxs font-sans text-vapor-dark opacity-85 select-none">
        <span>Ln 1, Col 1</span>
        <span>Windows (CRLF)</span>
      </div>
    </div>
  );
}
