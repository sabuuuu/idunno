import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { FeedbackButtons } from "~/features/feedback/components/feedback-buttons";
import { cn } from "~/lib/utils";
import type { MediaResult } from "~/features/recommendation/types/recommendation";

const TYPE_LABEL: Record<MediaResult["type"], string> = {
  movie: "Movie",
  tv: "TV Series",
  anime: "Anime",
};

interface ResultCardProps {
  result: MediaResult;
  sessionId: string;
}

export function ResultCard({ result, sessionId }: ResultCardProps) {
  const hasPoster =
    result.poster && result.poster !== "N/A";

  return (
    <Card className="w-full max-w-2xl overflow-hidden shadow-md">
      <div className="flex flex-col sm:flex-row">
        {hasPoster && (
          <div className="shrink-0">
            <img
              src={result.poster}
              alt={`${result.title} poster`}
              className="h-64 w-full object-cover sm:h-full sm:w-44"
            />
          </div>
        )}

        <CardContent
          className={cn(
            "flex flex-col justify-between gap-4 py-5",
            !hasPoster && "w-full",
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{TYPE_LABEL[result.type]}</Badge>
              {result.year && result.year !== "N/A" && (
                <Badge variant="outline">{result.year}</Badge>
              )}
              {result.rating && result.rating !== "N/A" && (
                <Badge variant="outline">★ {result.rating}</Badge>
              )}
            </div>

            <h1 className="text-2xl font-semibold leading-tight">
              {result.title}
            </h1>

            {result.genre && result.genre !== "N/A" && (
              <p className="text-xs text-muted-foreground">{result.genre}</p>
            )}
          </div>

          {result.rationale && (
            <blockquote className="border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">
              {result.rationale}
            </blockquote>
          )}

          {result.plot && result.plot !== "N/A" && (
            <p className="text-sm text-foreground/80 leading-relaxed">
              {result.plot}
            </p>
          )}

          <FeedbackButtons sessionId={sessionId} />
        </CardContent>
      </div>
    </Card>
  );
}
