import { createFileRoute, useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { FlowController } from "~/features/question-flow/components/flow-controller";
import { getQuestions } from "~/features/question-flow/server/questions";
import { useRecommend } from "~/features/recommendation/hooks/use-recommend";

export const Route = createFileRoute("/ask")({
  loader: () => getQuestions(),
  component: AskPage,
});

function AskPage() {
  const questions = Route.useLoaderData();
  const navigate = useNavigate();
  const { mutate: submitAnswers, isPending } = useRecommend();

  function handleComplete(answers: Record<string, string>) {
    submitAnswers(answers, {
      onSuccess: ({ sessionId }) => {
        navigate({ to: "/result/$sessionId", params: { sessionId } });
      },
      onError: (err) => toast.error(err.message),
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <FlowController
        questions={questions}
        onComplete={handleComplete}
        isPending={isPending}
      />
    </main>
  );
}
