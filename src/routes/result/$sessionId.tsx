import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ResultCard } from "~/features/recommendation/components/result-card";
import { getResult } from "~/features/recommendation/server/result";
import { ErrorWindow } from "~/components/ErrorWindow";
import type { ErrorComponentProps } from "@tanstack/react-router";

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
    <main className="relative flex flex-col items-center justify-center px-4 py-10 min-h-full">
      <div className="dot-grid absolute inset-0" aria-hidden="true" />
      <div className="crt-overlay absolute inset-0" aria-hidden="true" />
      <div className="z-10 w-full flex justify-center">
        <ResultCard result={result} sessionId={sessionId} />
      </div>
    </main>
  );
}

function ResultErrorBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isNotFound = error instanceof Error && error.message === "NOT_FOUND";

  if (isNotFound) return <ResultNotFound />;

  return (
    <ErrorWindow
      message="Something went wrong."
      subtitle={error instanceof Error ? error.message : "an unexpected error occurred ♡"}
      body="We hit a snag on our end. Try again or start fresh — your next recommendation is just three questions away."
      primaryLabel="TRY AGAIN ▶"
      onPrimary={() => router.invalidate()}
      secondaryLabel="START OVER ↺"
      onSecondary={() => { window.location.href = "/ask"; }}
    />
  );
}

function ResultNotFound() {
  return (
    <ErrorWindow
      message="Whoops! This pick got lost in the matrix."
      subtitle="even our robot had a bad day ♡"
      body="We couldn't find a movie match for your current vibe. Maybe the universe wants you to go for a walk? Or try answering the questions again — we promise we're listening this time."
      secondaryLabel="START OVER ↺"
      onSecondary={() => { window.location.href = "/ask"; }}
    />
  );
}
