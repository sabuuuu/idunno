"use client";

import { useEffect } from "react";
import { useQuestionFlow } from "~/features/question-flow/hooks/use-question-flow";
import { QuestionCard } from "./question-card";
import { ProgressDots } from "./progress-dots";
import { LoadingScreen } from "./loading-screen";
import type { Question } from "~/types/db";

interface FlowControllerProps {
  questions: Question[];
  onComplete: (answers: Record<string, string>) => void;
  isPending?: boolean;
}

export function FlowController({
  questions,
  onComplete,
  isPending = false,
}: FlowControllerProps) {
  const { step, currentIndex, answers, selectAnswer, goToNext, goBack } =
    useQuestionFlow(questions);

  useEffect(() => {
    if (step === "submitting") {
      onComplete(answers);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending) {
    return <LoadingScreen />;
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[600px] z-10">

      <ProgressDots total={questions.length} current={currentIndex} />

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedOption={answers[currentQuestion.id]}
        onSelect={(option) => selectAnswer(currentQuestion.id, option)}
        onBack={currentIndex > 0 ? goBack : null}
        onNext={goToNext}
        isLastQuestion={currentIndex === questions.length - 1}
      />

      <p style={{ fontFamily: "'VT323', monospace", fontSize: "18px", color: "#7a4a52" }}>
        use arrow keys or click to select
      </p>
    </div>
  );
}
