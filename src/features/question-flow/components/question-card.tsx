"use client";

import type { Question } from "~/types/db";
import { Button } from "~/components/ui/button";

// A → B → C → D labels for options
const OPTION_LABELS = ["A", "B", "C", "D", "E"];

interface QuestionCardProps {
  question: Question;
  questionNumber: number; // 1-based
  totalQuestions: number;
  selectedOptions?: string[];
  onSelect: (option: string) => void;
  onBack: (() => void) | null; // null on first question
  onNext: () => void;
  isLastQuestion: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions: _totalQuestions,
  selectedOptions,
  onSelect,
  onBack,
  onNext,
  isLastQuestion,
}: QuestionCardProps) {
  return (
    <div className="w-full relative">
      <div className="bg-background p-6">
        <div className="flex justify-center mb-4">
          <span
            className="px-3 py-1 text-vapor-cream uppercase font-pixel text-[8px] tracking-wider bg-vapor-rose rounded-full border-2 border-vapor-rose"
          >
            MOOD CHECK
          </span>
        </div>
        {questionNumber > 1 && (
          <p className="text-center text-vapor-rose-dark mb-6 font-pixel text-micro tracking-widest">
            (SELECT UP TO 3)
          </p>
        )}

        <div className="mb-8 text-center px-2">
          <p className="text-vapor-dark font-pixel text-[13px] leading-[2.2]">
            {question.text}
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-8">
          {Array.from(new Set(question.options)).map((option, i) => {
            const isSelected = selectedOptions?.includes(option) ?? false;
            return (
              <Button
                key={option}
                onClick={() => onSelect(option)}
                aria-pressed={isSelected}
                variant="ghost"
                className={`justify-start h-auto flex items-center gap-4 px-4 py-3 w-full text-left transition-colors border-2 border-vapor-rose cursor-pointer rounded-none hover:bg-vapor-pink ${isSelected ? 'bg-vapor-pink' : 'bg-vapor-cream'}`}
              >
                <div className={`w-4 h-4 shrink-0 border-2 border-vapor-rose flex items-center justify-center ${isSelected ? 'bg-vapor-rose' : 'bg-transparent'}`}>
                  {isSelected && (
                    <div className="w-1.5 h-1.5 bg-vapor-cream" />
                  )}
                </div>

                <span className="text-vapor-dark font-sans text-sm font-medium">
                  <span className="mr-2 font-pixel text-[8px] text-vapor-rose">
                    {OPTION_LABELS[i] ?? String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="vapor"
            onClick={onBack ?? undefined}
            disabled={!onBack}
            className="h-auto px-6 py-2 text-vapor-dark disabled:opacity-30 disabled:cursor-not-allowed font-pixel text-xxs tracking-[0.08em] bg-vapor-muted shadow-win98-out"
          >
            ◀ BACK
          </Button>

          <Button
            variant="vapor"
            onClick={onNext}
            disabled={!selectedOptions || selectedOptions.length === 0}
            className="h-auto px-6 py-2 text-vapor-cream bg-vapor-rose disabled:opacity-40 disabled:cursor-not-allowed font-pixel text-xxs tracking-[0.08em] shadow-win98-out"
          >
            {isLastQuestion ? "SUBMIT ▶" : "NEXT ▶"}
          </Button>
        </div>
      </div>
    </div>
  );
}
