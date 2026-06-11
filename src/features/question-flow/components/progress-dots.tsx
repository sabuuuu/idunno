import { cn } from "~/lib/utils";

interface ProgressDotsProps {
  total: number;
  current: number; // 0-based
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i < current
              ? "w-4 bg-primary"
              : i === current
                ? "w-4 bg-primary"
                : "w-1.5 bg-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}
