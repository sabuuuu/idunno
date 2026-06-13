import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ResultCard } from "~/features/recommendation/components/result-card";
import { getResult } from "~/features/recommendation/server/result";
import { ErrorWindow } from "~/components/ErrorWindow";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { WindowPortal } from "~/components/desktop/WindowPortal";

export const Route = createFileRoute("/result/$sessionId")({
  loader: ({ params }) => getResult({ data: params.sessionId }),
  component: ResultPage,
  errorComponent: ResultErrorBoundary,
  notFoundComponent: ResultNotFound,
});

function ResultPage() {
  const result = Route.useLoaderData();
  const { sessionId } = Route.useParams();

  return (
    <WindowPortal
      id="result-window"
      title="MATCH.DAT"
      componentType="result"
      x={typeof window !== "undefined" ? Math.max(0, (window.innerWidth - 1100) / 2) : 100}
      y={typeof window !== "undefined" ? Math.max(20, (window.innerHeight - 800) / 2 - 60) : 20}
      width={1000}
      height={750}
    >
      <main className="relative flex flex-col items-center justify-center p-4 min-h-full">
        <div className="z-10 w-full flex justify-center">
          <ResultCard result={result} sessionId={sessionId} />
        </div>
      </main>
    </WindowPortal>
  );
}

function ResultErrorBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isNotFound = error instanceof Error && error.message === "NOT_FOUND";

  if (isNotFound) return <ResultNotFound />;

  return (
    <WindowPortal
      id="error-window"
      title="ERROR.LOG"
      componentType="generic"
      x={typeof window !== "undefined" ? Math.max(0, (window.innerWidth - 550) / 2) : 200}
      y={typeof window !== "undefined" ? Math.max(0, (window.innerHeight - 400) / 2) : 150}
      width={550}
      height={400}
    >
      <ErrorWindow
        message="Something went wrong."
        subtitle={error instanceof Error ? error.message : "an unexpected error occurred ♡"}
        body="We hit a snag on our end. Try again or start fresh — your next recommendation is just three questions away."
        primaryLabel="TRY AGAIN ▶"
        onPrimary={() => router.invalidate()}
        secondaryLabel="START OVER ↺"
        onSecondary={() => router.navigate({ to: "/ask" })}
      />
    </WindowPortal>
  );
}

function ResultNotFound() {
  const router = useRouter();
  return (
    <WindowPortal
      id="not-found-window"
      title="404.LOG"
      componentType="generic"
      x={typeof window !== "undefined" ? Math.max(0, (window.innerWidth - 550) / 2) : 200}
      y={typeof window !== "undefined" ? Math.max(0, (window.innerHeight - 400) / 2) : 150}
      width={550}
      height={400}
    >
      <ErrorWindow
        message="Whoops! This pick got lost in the matrix."
        subtitle="even our robot had a bad day ♡"
        body="We couldn't find a movie match for your current vibe. Maybe the universe wants you to go for a walk? Or try answering the questions again — we promise we're listening this time."
        secondaryLabel="START OVER ↺"
        onSecondary={() => router.navigate({ to: "/ask" })}
      />
    </WindowPortal>
  );
}
