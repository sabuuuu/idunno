interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: i <= current ? "var(--vapor-rose)" : "transparent",
            border: "2px solid var(--vapor-rose)",
            transition: "background-color 0.2s",
          }}
        />
      ))}
    </div>
  );
}
