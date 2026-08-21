"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion";

interface GridSidebarProps {
  categories: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

function CustomCheckbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        "w-4 h-4 border-[1.5px] border-gray-400 flex items-center justify-center shrink-0 transition-colors",
        checked && "border-red-500"
      )}
    >
      {checked && (
        <div className="w-2.5 h-2.5 bg-red-500" />
      )}
    </div>
  );
}

export default function GridSidebar({
  categories,
  selected,
  onChange,
  className = "",
}: GridSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();

  function toggle(cat: string) {
    const next = selected.includes(cat)
      ? selected.filter((c) => c !== cat)
      : [...selected, cat];
    onChange(next);
  }

  const content = (
    <div className="space-y-0.5">
      {categories.map((cat) => (
        <label
          key={cat}
          className="flex items-center gap-3 py-2.5 px-3 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <input
            type="checkbox"
            checked={selected.includes(cat)}
            onChange={() => toggle(cat)}
            className="sr-only"
          />
          <CustomCheckbox checked={selected.includes(cat)} />
          <span className="text-[13px] font-semibold uppercase tracking-wider text-gray-600">
            {cat}
          </span>
        </label>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile: collapsible toggle above grid */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-between w-full px-4 py-3 bg-gray-100"
        >
          <span className="text-[13px] font-semibold uppercase tracking-wider text-gray-600">
            Sort by
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "text-gray-500 transition-transform",
              mobileOpen && "rotate-180"
            )}
          />
        </button>
        {mobileOpen && (
          <div className="bg-gray-100 px-2 py-2 border-t border-gray-200">
            {content}
          </div>
        )}
      </div>

      {/* Desktop: fixed-width sidebar column */}
      <div className={cn("bg-gray-100 py-4", className)}>
        <p className="text-[13px] font-semibold uppercase tracking-wider text-gray-600 mb-3 px-3">
          Sort by
        </p>
        {content}
      </div>
    </>
  );
}
