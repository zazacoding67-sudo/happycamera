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
    <div className="space-y-1">
      {categories.map((cat) => (
        <label
          key={cat}
          className="flex items-center gap-3 py-2.5 px-3 cursor-pointer hover:bg-gray-50 rounded transition-colors"
        >
          <input
            type="checkbox"
            checked={selected.includes(cat)}
            onChange={() => toggle(cat)}
            className="w-4 h-4 border-gray-300 rounded-sm text-black focus:ring-black cursor-pointer"
          />
          <span className="text-[13px] font-medium text-zinc-700">{cat}</span>
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
          className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 bg-white"
        >
          <span className="text-[13px] font-semibold uppercase tracking-wider text-zinc-900">
            Filter by
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "text-zinc-500 transition-transform",
              mobileOpen && "rotate-180"
            )}
          />
        </button>
        {mobileOpen && (
          <div className="border border-t-0 border-gray-200 bg-white px-2 py-2">
            {content}
          </div>
        )}
      </div>

      {/* Desktop: fixed-width sidebar column */}
      <div className={className}>
        <p className="text-[13px] font-semibold uppercase tracking-wider text-zinc-900 mb-4 px-3">
          Filter by
        </p>
        {content}
      </div>
    </>
  );
}
