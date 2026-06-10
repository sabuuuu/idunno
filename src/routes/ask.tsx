import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ask")({
  component: AskPage,
});

// Placeholder — wired up in phase 1
function AskPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Question flow coming in phase 1.</p>
    </main>
  );
}
