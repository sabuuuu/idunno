import { createFileRoute } from "@tanstack/react-router";
import { FlowController } from "~/features/question-flow/components/flow-controller";
import { getQuestions } from "~/features/question-flow/server/questions";

export const Route = createFileRoute("/ask")({
  loader: () => getQuestions(),
  component: AskPage,
});

function AskPage() {
  const questions = Route.useLoaderData();

  function handleComplete(answers: Record<string, string>) {
    // Phase 1: just log — phase 2 will call the LLM here
    console.log("Answers collected:", answers);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <FlowController questions={questions} onComplete={handleComplete} />
    </main>
  );
}
