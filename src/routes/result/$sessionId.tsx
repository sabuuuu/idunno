import { createFileRoute, Link } from "@tanstack/react-router";
import { ResultCard } from "~/features/recommendation/components/result-card";
import { getResult } from "~/features/recommendation/server/result";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/result/$sessionId")({
  loader: ({ params }) => getResult({ data: params.sessionId }),
  component: ResultPage,
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
