import * as React from "react";
import { WindowTitleBar } from "~/components/WindowTitleBar";
import { FeedbackButtons } from "~/features/feedback/components/feedback-buttons";
import type { MediaResult } from "~/features/recommendation/types/recommendation";

const TYPE_LABEL: Record<MediaResult["type"], string> = {
  movie: "MOVIE",
  tv:    "TV SERIES",
  anime: "ANIME",
};

// Star rating — filled stars up to 5, capped at imdb-style 10-point scale
function StarRating({ rating }: { rating: string }) {
  const num = parseFloat(rating);
  if (isNaN(num)) return null;
  // Convert to 0-5 scale (IMDB is /10, MAL is /10)
  const stars = Math.round((num / 10) * 5);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{ color: i < stars ? "#8a4853" : "#D7C1C3", fontSize: "16px" }}
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
  const hasPoster = Boolean(result.poster && result.poster !== "N/A");

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        maxWidth: "896px",
        backgroundColor: "#F4ECEB",
        border: "2px solid #B76E79",
        boxShadow: "4px 4px 0px 0px #B76E79",
      }}
    >
      {/* Scanline sweep beam */}
      <div className="scanline-beam" aria-hidden="true" />

      {/* Title bar */}
      <WindowTitleBar label={`result.exe — ${result.title.toLowerCase()}`} />

      <div className="flex flex-col md:flex-row relative z-10">

        {/* ── Left: Poster panel ── */}
        {hasPoster && (
          <div
            className="w-full md:w-1/2 p-3 flex flex-col items-center justify-center gap-2"
            style={{ borderRight: "2px solid rgba(183,110,121,0.2)" }}
          >
            {/* Poster with pixel border + inset glow */}
            <div
              className="relative w-full"
              style={{ border: "2px solid #B76E79", padding: "4px", backgroundColor: "#fff" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: "inset 0 0 15px rgba(183,110,121,0.3)" }}
              />
              <img
                src={result.poster}
                alt={`${result.title} poster`}
                className="w-full object-cover"
                style={{
                  aspectRatio: "2/3",
                  display: "block",
                  filter: "grayscale(20%)",
                  transition: "filter 0.5s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(20%)"; }}
              />
            </div>

            {/* Pixel dots below poster */}
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    backgroundColor: i === 0 ? "#8a4853" : "transparent",
                    border: "1px solid #8a4853",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Right: Data panel ── */}
        <div
          className="flex flex-col gap-3 p-4 flex-1"
          style={{ backgroundColor: "rgba(252,249,248,0.5)" }}
        >
          {/* Title + year badge */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <h1
                className="leading-none uppercase"
                style={{ fontFamily: "'VT323', monospace", fontSize: "32px", color: "#8a4853" }}
              >
                {result.title}
              </h1>
              {result.year && result.year !== "N/A" && (
                <span
                  className="shrink-0 flex items-center justify-center rounded-full text-[#8a4853]"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "10px",
                    fontWeight: 700,
                    border: "2px solid #8a4853",
                    width: "32px",
                    height: "32px",
                  }}
                >
                  {result.year}
                </span>
              )}
            </div>

            {/* Type tag + stars */}
            <div className="flex items-center gap-4">
              <span
                className="inventory-tag px-2 py-1"
                style={{ fontFamily: "'VT323', monospace", fontSize: "16px", color: "#8a4853" }}
              >
                {TYPE_LABEL[result.type]}
              </span>
              {result.rating && result.rating !== "N/A" && (
                <StarRating rating={result.rating} />
              )}
            </div>
          </div>

          {/* Speech bubble blockquote */}
          {result.rationale && (
            <div className="relative ml-4 mt-1">
              {/* Arrow */}
              <div
                className="absolute"
                style={{
                  left: "-10px",
                  top: "20px",
                  width: 0,
                  height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderRight: "10px solid #B76E79",
                }}
              />
              <div
                className="absolute"
                style={{
                  left: "-6px",
                  top: "22px",
                  width: 0,
                  height: 0,
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderRight: "8px solid #F4ECEB",
                }}
              />
              <blockquote
                className="italic leading-tight"
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "20px",
                  color: "#8a4853",
                  backgroundColor: "#F4ECEB",
                  border: "2px solid #B76E79",
                  padding: "8px 12px",
                }}
              >
                "{result.rationale}"
              </blockquote>
            </div>
          )}

          {/* Genre tags */}
          {result.genre && result.genre !== "N/A" && (
            <div className="flex flex-wrap gap-2">
              {result.genre.split(",").slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="text-white uppercase"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    backgroundColor: "#605b5a",
                    borderRadius: "9999px",
                    padding: "4px 12px",
                  }}
                >
                  {g.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Plot */}
          {result.plot && result.plot !== "N/A" && (
            <p
              className="leading-relaxed"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#524345",
              }}
            >
              {result.plot}
            </p>
          )}

          {/* Bottom actions */}
          <div
            className="mt-auto pt-4 flex items-center justify-between"
            style={{ borderTop: "1px dashed rgba(183,110,121,0.3)" }}
          >
            <FeedbackButtons sessionId={sessionId} />

            <button
              onClick={() => window.location.href = "/ask"}
              className="uppercase pixel-shadow-active"
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: "18px",
                color: "#ffffff",
                backgroundColor: "#8a4853",
                border: "2px solid #B76E79",
                padding: "6px 16px",
                letterSpacing: "0.05em",
              }}
            >
              NEW PICK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
