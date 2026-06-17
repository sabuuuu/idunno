import React from "react";
import { useWindowManager } from "~/components/desktop/useWindowManager";
import { Button } from "~/components/ui/button";
import { toPng, toBlob } from "html-to-image";
import toast from "react-hot-toast";
import { Save, Copy } from "lucide-react";

interface ShareDialogProps {
  id: string; // The window ID to close
  title: string;
  year: string;
  type: "movie" | "tv" | "anime";
  imdbId?: string;
  malId?: number;
}

export function ShareDialog({ id, title, year: _year, type: _type, imdbId: _imdbId, malId: _malId }: ShareDialogProps) {
  const { closeWindow } = useWindowManager();

  const handleDownload = async () => {
    const contentNode = document.getElementById("window-content-result-window");
    const windowNode = contentNode?.parentElement;
    if (!windowNode) {
      toast.error("Could not find result window to export.");
      return;
    }

    try {
      const width = windowNode.offsetWidth;
      const height = windowNode.offsetHeight;
      const dataUrl = await toPng(windowNode, {
        cacheBust: true,
        width,
        height,
        style: {
          transform: "none",
          left: "0",
          top: "0",
          margin: "0",
          position: "relative",
        },
      });
      const link = document.createElement("a");
      const filename = `idonnu-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-window.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
      toast.success("Window screenshot saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate image download.");
    }
  };

  const handleCopy = async () => {
    const contentNode = document.getElementById("window-content-result-window");
    const windowNode = contentNode?.parentElement;
    if (!windowNode) {
      toast.error("Could not find result window to export.");
      return;
    }

    try {
      const width = windowNode.offsetWidth;
      const height = windowNode.offsetHeight;
      const blob = await toBlob(windowNode, {
        cacheBust: true,
        width,
        height,
        style: {
          transform: "none",
          left: "0",
          top: "0",
          margin: "0",
          position: "relative",
        },
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        toast.success("Window screenshot copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not copy image to clipboard. Try downloading instead.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 h-full bg-vapor-cream text-vapor-dark font-sans select-none">
      <div className="w-full flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-14 h-14 bg-vapor-rose-dark/15 border border-vapor-rose-dark/30 rounded-full flex items-center justify-center text-vapor-rose-dark select-none shadow-win98-in">
          <Save size={24} />
        </div>
        <div className="flex flex-col gap-2 max-w-[320px]">
          <p className="font-pixel text-micro font-bold text-vapor-rose-dark uppercase tracking-wider">
            RECOMMENDATION.EXE
          </p>
          <p className="font-sans text-xs leading-relaxed text-vapor-dark opacity-90">
            Export the complete recommendation window.
          </p>
        </div>
      </div>

      {/* Control Panel Action Buttons */}
      <div className="w-full flex flex-col gap-2 mt-4 pt-3 border-t border-dashed border-vapor-rose/30">
        <div className="flex justify-center gap-2 w-full">
          <Button
            variant="vapor"
            onClick={handleDownload}
            className="flex-1 font-pixel text-micro tracking-wide uppercase h-10 px-3 bg-vapor-muted border border-vapor-dark shadow-win98-out flex items-center justify-center gap-1.5"
          >
            <Save size={12} className="shrink-0" />
            DOWNLOAD PNG
          </Button>
          <Button
            variant="vapor"
            onClick={handleCopy}
            className="flex-1 font-pixel text-micro tracking-wide uppercase h-10 px-3 bg-vapor-muted border border-vapor-dark shadow-win98-out flex items-center justify-center gap-1.5"
          >
            <Copy size={12} className="shrink-0" />
            COPY IMAGE
          </Button>
        </div>
        <Button
          variant="vapor"
          onClick={() => closeWindow(id)}
          className="w-full font-pixel text-micro tracking-wide uppercase h-8 bg-vapor-cream border border-vapor-dark shadow-win98-out"
        >
          CLOSE
        </Button>
      </div>
    </div>
  );
}
