"use client";

import { WindowTitleBar } from "~/components/WindowTitleBar";
import type { Question } from "~/types/db";

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
  totalQuestions,
  selectedOptions,
  onSelect,
  onBack,
  onNext,
  isLastQuestion,
}: QuestionCardProps) {
  return (
    <div
      className="w-full relative"
    >
      {/* ── Body ── */}

      {/* ── Body ── */}
      <div className="bg-background p-6">
        {/* Badge chip */}
        <div className="flex justify-center mb-4">
          <span
            className="px-3 py-1 text-[#f4eceb] uppercase"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
              letterSpacing: "0.05em",
              backgroundColor: "#b76e79",
              borderRadius: "999px",
              border: "2px solid #b76e79",
            }}
          >
            MOOD CHECK
          </span>
        </div>
        {questionNumber > 1 && (
          <p className="text-center text-[#7a4a52] mb-6" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", letterSpacing: "0.1em" }}>
            (SELECT UP TO 3)
          </p>
        )}

        {/* Question text */}
        <div className="mb-8 text-center px-2">
          <p
            className="text-[#1a1a1a]"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "13px",
              lineHeight: "2.2",
            }}
          >
            {question.text}
          </p>
        </div>

        {/* Answer rows */}
        <div className="flex flex-col gap-2 mb-8">
          {Array.from(new Set(question.options)).map((option, i) => {
            const isSelected = selectedOptions?.includes(option) ?? false;
            return (
              <button
                key={option}
                onClick={() => onSelect(option)}
                aria-pressed={isSelected}
                className="flex items-center gap-4 px-4 py-3 w-full text-left transition-colors"
                style={{
                  border: "2px solid #b76e79",
                  backgroundColor: isSelected ? "#d4a0a8" : "#f4eceb",
                  cursor: "pointer",
                }}
              >
                {/* Checkbox */}
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    border: "2px solid #b76e79",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? "#b76e79" : "transparent",
                  }}
                >
                  {isSelected && (
                    <div style={{ width: "6px", height: "6px", backgroundColor: "#f4eceb" }} />
                  )}
                </div>

                {/* Label + text */}
                <span
                  className="text-[#1a1a1a]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500 }}
                >
                  <span
                    className="mr-2"
                    style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#b76e79" }}
                  >
                    {OPTION_LABELS[i] ?? String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between">
          {/* Back — ghost pill */}
          <button
            onClick={onBack ?? undefined}
            disabled={!onBack}
            className="px-6 py-3 text-[#b76e79] bg-background disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "10px",
              letterSpacing: "0.08em",
              borderRadius: "999px",
              border: "2px solid #b76e79",
            }}
          >
            ◀ BACK
          </button>

          {/* Next / Submit — filled pill */}
          <button
            onClick={onNext}
            disabled={!selectedOptions || selectedOptions.length === 0}
            className="px-6 py-3 text-[#f4eceb] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "10px",
              letterSpacing: "0.08em",
              borderRadius: "999px",
              backgroundColor: "#b76e79",
              border: "2px solid #7a4a52",
              boxShadow: selectedOptions && selectedOptions.length > 0 ? "3px 3px 0px #7a4a52" : "none",
              transition: "box-shadow 0.1s",
            }}
          >
            {isLastQuestion ? "SUBMIT ▶" : "NEXT ▶"}
          </button>
        </div>
      </div>
    </div>
  );
}
