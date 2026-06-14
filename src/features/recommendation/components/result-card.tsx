import { FeedbackButtons } from "~/features/feedback/components/feedback-buttons";
import { useNavigate } from "@tanstack/react-router";
import type { MediaResult } from "~/features/recommendation/types/recommendation";
import { Button } from "~/components/ui/button";
import { toggleWatchlist } from "~/features/feedback/server/feedback";
import toast from "react-hot-toast";

const TYPE_LABEL: Record<MediaResult["type"], string> = {
  movie: "MOVIE",
  tv: "TV SERIES",
  anime: "ANIME",
};

function StarRating({ rating }: { rating: string }) {
  const num = parseFloat(rating);
  if (isNaN(num)) return null;
  const stars = Math.round((num / 10) * 5);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-base ${i < stars ? "text-vapor-rose-dark" : "text-border"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

interface ResultCardProps {
  result: MediaResult;
  sessionId: string;
}

export function ResultCard({ result, sessionId }: ResultCardProps) {
  const navigate = useNavigate();
  const hasPoster = Boolean(result.poster && result.poster !== "N/A");

  return (
    <div className="w-full relative overflow-hidden max-w-[896px] bg-vapor-cream">
      <div className="scanline-beam" aria-hidden="true" />



      <div className="flex flex-col md:flex-row relative z-10">
        {hasPoster && (
          <div className="w-full md:w-1/2 p-3 flex flex-col items-center justify-center gap-2 border-r-2 border-vapor-rose/20">
            <div className="relative w-full border-2 border-vapor-rose p-1 bg-white">
              <div
                className="absolute inset-0 pointer-events-none shadow-[inset_0_0_15px_rgba(183,110,121,0.3)]"
              />
              <img
                src={result.poster}
                alt={`${result.title} poster`}
                className="w-full object-cover aspect-2/3 block grayscale-20 transition-all duration-500 hover:grayscale-0"
              />
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`inline-block w-2 h-2 border border-vapor-rose-dark ${i === 0 ? "bg-vapor-rose-dark" : "bg-transparent"}`}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3 p-4 flex-1 bg-[rgba(252,249,248,0.5)]">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <h1 className="leading-none uppercase font-retro text-[32px] text-vapor-rose-dark">
                {result.title}
              </h1>
              {result.year && result.year !== "N/A" && (
                <span className="shrink-0 flex items-center justify-center rounded-full text-vapor-rose-dark font-mono text-[10px] font-bold border-2 border-vapor-rose-dark px-2.5 h-7 min-w-[28px]">
                  {result.year}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="inventory-tag px-2 py-1 font-retro text-base text-vapor-rose-dark">
                {TYPE_LABEL[result.type]}
              </span>
              {result.rating && result.rating !== "N/A" && (
                <StarRating rating={result.rating} />
              )}
            </div>
          </div>
          {result.rationale && (
            <div className="relative ml-4 mt-1">
              <div
                className="absolute left-[-10px] top-[20px] w-0 h-0 border-y-10 border-y-transparent border-r-10 border-r-vapor-rose"
              />
              <div
                className="absolute left-[-6px] top-[22px] w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-vapor-cream"
              />
              <blockquote className="italic leading-tight font-retro text-xl text-vapor-rose-dark bg-vapor-cream border-2 border-vapor-rose px-3 py-2">
                "{result.rationale}"
              </blockquote>
            </div>
          )}
          {result.genre && result.genre !== "N/A" && (
            <div className="flex flex-wrap gap-2">
              {result.genre.split(",").slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="text-white uppercase font-mono text-[10px] font-bold tracking-widest bg-[#605b5a] rounded-full px-3 py-1"
                >
                  {g.trim()}
                </span>
              ))}
            </div>
          )}
          {result.plot && result.plot !== "N/A" && (
            <p className="leading-relaxed font-sans text-sm text-vapor-dark opacity-80">
              {result.plot}
            </p>
          )}
          <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-vapor-rose/30">
            <FeedbackButtons sessionId={sessionId} />
            <div className="flex gap-2">
              <Button
                variant="vapor-primary"
                onClick={async () => {
                  try {
                    await toggleWatchlist({ data: { sessionId, inWatchlist: true } });
                    toast.success("Added to watchlist");
                  } catch (e) {
                    toast.error((e as Error).message || "Failed to add to watchlist");
                  }
                }}
                className="uppercase h-auto px-4 py-1.5"
              >
                + WATCHLIST
              </Button>

              <Button
                variant="vapor-primary"
                onClick={() => navigate({ to: "/ask" })}
                className="uppercase h-auto px-4 py-1.5"
              >
                NEW PICK
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
