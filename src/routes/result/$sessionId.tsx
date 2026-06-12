import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ResultCard } from "~/features/recommendation/components/result-card";
import { getResult } from "~/features/recommendation/server/result";
import { Button } from "~/components/ui/button";
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Your pick
      </p>

      <ResultCard result={result} sessionId={sessionId} />

      <Button variant="ghost" size="sm" asChild>
        <Link to="/ask">Start over</Link>
      </Button>
    </main>
  );
}

function ResultErrorBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isNotFound =
    error instanceof Error && error.message === "NOT_FOUND";

  if (isNotFound) {
    return <ResultNotFound />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
      <p className="text-sm text-muted-foreground">
        {error instanceof Error ? error.message : "Something went wrong."}
      </p>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => router.invalidate()}>
          Try again
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/ask">Start over</Link>
        </Button>
      </div>
    </main>
  );
}

function ResultNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
      <p className="text-sm text-muted-foreground">
        This result doesn't exist or has expired.
      </p>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/ask">Start over</Link>
      </Button>
    </main>
  );
}
