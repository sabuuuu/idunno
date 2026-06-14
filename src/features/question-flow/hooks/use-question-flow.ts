import { useState } from "react";
import type { Question } from "~/types/db";

export type FlowStep = "idle" | `q${number}` | "submitting" | "done";

function stepForIndex(i: number): FlowStep {
  return `q${i + 1}`;
}

export interface QuestionFlowState {
  step: FlowStep;
  currentIndex: number;
  answers: Record<string, string[]>;
  selectAnswer: (questionId: string, option: string, isSingleSelect?: boolean) => void;
  goToNext: () => void;
  goBack: () => void;
  reset: () => void;
}

export function useQuestionFlow(questions: Question[]): QuestionFlowState {
  const [step, setStep] = useState<FlowStep>(stepForIndex(0));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  function selectAnswer(questionId: string, option: string, isSingleSelect: boolean = false) {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (isSingleSelect) {
        return { ...prev, [questionId]: [option] };
      }
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter((o) => o !== option) };
      }
      if (current.length >= 3) {
        return prev;
      }
      return { ...prev, [questionId]: [...current, option] };
    });
  }

  function goToNext() {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setStep(stepForIndex(nextIndex));
    } else {
      setStep("submitting");
    }
  }

  function goBack() {
    if (currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    setStep(stepForIndex(prevIndex));
  }

  function reset() {
    setStep(stepForIndex(0));
    setCurrentIndex(0);
    setAnswers({});
  }

  return { step, currentIndex, answers, selectAnswer, goToNext, goBack, reset };
}
