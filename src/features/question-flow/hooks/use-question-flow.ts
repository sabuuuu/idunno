import { useState } from "react";
import type { Question } from "~/types/db";

export type FlowStep = "idle" | "q1" | "q2" | "q3" | "submitting" | "done";

const STEPS: FlowStep[] = ["q1", "q2", "q3"];

export interface QuestionFlowState {
  step: FlowStep;
  currentIndex: number;
  answers: Record<string, string>; // questionId → selectedOption
  selectAnswer: (questionId: string, option: string) => void;
  goToNext: () => void;
  goBack: () => void;
  reset: () => void;
}

export function useQuestionFlow(questions: Question[]): QuestionFlowState {
  const [step, setStep] = useState<FlowStep>("q1");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  function selectAnswer(questionId: string, option: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  function goToNext() {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setStep(STEPS[nextIndex] ?? "submitting");
    } else {
      setStep("submitting");
    }
  }

  function goBack() {
    if (currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    setStep(STEPS[prevIndex] ?? "q1");
  }

  function reset() {
    setStep("q1");
    setCurrentIndex(0);
    setAnswers({});
  }

  return { step, currentIndex, answers, selectAnswer, goToNext, goBack, reset };
}
