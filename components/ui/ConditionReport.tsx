"use client";

import { ShieldCheck, FileText, PackageOpen, Camera } from "lucide-react";
import type { ConditionGrade } from "@/types";

const gradeLabels: Record<string, string> = {
  MINT: "Mint",
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
};

const gradeColors: Record<string, string> = {
  MINT: "text-green-700 bg-green-50 border-green-200",
  EXCELLENT: "text-blue-700 bg-blue-50 border-blue-200",
  GOOD: "text-yellow-700 bg-yellow-50 border-yellow-200",
  FAIR: "text-orange-700 bg-orange-50 border-orange-200",
};

interface Props {
  grade: ConditionGrade;
  notes: string | null;
  accessories: string[];
  shutterCount: number | null;
  mount?: string | null;
  format?: string | null;
}

export default function ConditionReport({
  grade,
  notes,
  accessories,
  shutterCount,
  mount,
  format,
}: Props) {
  if (!grade) return null;

  return (
    <div className="mt-8 border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
      <div className="px-4 py-3 flex items-center gap-2 bg-[var(--color-bg)]">
        <ShieldCheck size={14} className="text-[var(--color-text-secondary)]" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
          Condition Report
        </span>
      </div>

      <div className="px-4 py-3 flex items-center gap-3">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-0.5 border ${gradeColors[grade] || ""}`}
        >
          {gradeLabels[grade] || grade}
        </span>
          {mount && (
            <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg)] px-2 py-0.5 rounded-full">
              {mount}
            </span>
          )}
          {format && (
            <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg)] px-2 py-0.5 rounded-full">
              {format}
            </span>
          )}
          {shutterCount !== null && shutterCount !== undefined && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
              <Camera size={12} />
              {shutterCount.toLocaleString()} actuations
            </span>
          )}
        </div>

      {notes && (
        <div className="px-4 py-3 flex items-start gap-2">
          <FileText
            size={14}
            className="text-[var(--color-text-secondary)] mt-0.5 shrink-0"
          />
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {notes}
          </p>
        </div>
      )}

      {accessories.length > 0 && (
        <div className="px-4 py-3 flex items-start gap-2">
          <PackageOpen
            size={14}
            className="text-[var(--color-text-secondary)] mt-0.5 shrink-0"
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">
              Includes
            </p>
            <ul className="text-xs text-[var(--color-text-secondary)] space-y-0.5">
              {accessories.map((acc, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)]" />
                  {acc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
