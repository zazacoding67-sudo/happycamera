"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Basket", "Delivery", "Payment", "Done"] as const;

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav
      aria-label="Checkout progress"
      className="w-full max-w-2xl mx-auto"
    >
      <ol className="flex items-center">
        {STEPS.map((label, index) => {
          const step = index + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isLast = index === STEPS.length - 1;

          return (
            <li key={label} className={cn("flex items-center", !isLast && "flex-1")}>
              {/* Step node */}
              <div className="flex flex-col items-center shrink-0">
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold border transition-colors",
                    isCompleted &&
                      "bg-emerald-600 border-emerald-600 text-white",
                    isCurrent && "bg-[var(--color-text-primary)] border-[var(--color-text-primary)] text-white",
                    !isCompleted && !isCurrent &&
                      "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? <Check size={16} strokeWidth={2.5} /> : step}
                </span>
                <span
                  className={cn(
                    "mt-2 text-[10px] font-medium uppercase tracking-widest",
                    isCurrent
                      ? "text-[var(--color-text-primary)]"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-[var(--color-text-secondary)]"
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-px mx-3 mb-6",
                    step < currentStep
                      ? "bg-emerald-600"
                      : "bg-[var(--color-border)]"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
