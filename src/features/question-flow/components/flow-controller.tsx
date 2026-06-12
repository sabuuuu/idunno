"use client";

import { useEffect } from "react";
import { useQuestionFlow } from "~/features/question-flow/hooks/use-question-flow";
import { QuestionCard } from "./question-card";
import { ProgressDots } from "./progress-dots";
import { Loader } from "~/components/Loader";
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
  const { step, currentIndex, answers, selectAnswer, goToNext } =
    useQuestionFlow(questions);

  useEffect(() => {
    if (step === "submitting") {
      onComplete(answers);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-12">
        <Loader />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return null;

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-12 w-full max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <ProgressDots total={questions.length} current={currentIndex} />

      <QuestionCard
        question={currentQuestion}
        selectedOption={answers[currentQuestion.id]}
        onSelect={(option) => selectAnswer(currentQuestion.id, option)}
        onNext={goToNext}
        isLastQuestion={isLastQuestion}
      />
    </div>
  );
}
