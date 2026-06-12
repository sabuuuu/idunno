"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { Question } from "~/types/db";

interface QuestionCardProps {
  question: Question;
  selectedOption?: string;
  onSelect: (option: string) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

export function QuestionCard({
  question,
  selectedOption,
  onSelect,
  onNext,
  isLastQuestion,
}: QuestionCardProps) {
  return (
    <Card className="w-full max-w-lg border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold leading-snug">
          {question.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {Array.from(new Set(question.options)).map((option) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all duration-150",
                "hover:border-primary/60 hover:bg-primary/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground",
              )}
              aria-pressed={isSelected}
            >
              {option}
            </button>
          );
        })}
        <Button
          onClick={onNext}
          disabled={!selectedOption}
          className="mt-2 w-full"
        >
          {isLastQuestion ? "Submit" : "Next"}
        </Button>
      </CardContent>
    </Card>
  );
}
