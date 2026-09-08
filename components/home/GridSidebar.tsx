"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion";

interface GridSidebarProps {
  categories: string[];
  selected: string;
  onChange: (cat: string) => void;
  className?: string;
  showMobile?: boolean;
}

function CategoryRow({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-3 py-2.5 px-3 cursor-pointer group/opt transition-colors duration-150 hover:bg-neutral-50 rounded-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-[18px] h-[18px] border-2 border-neutral-300 rounded-[3px] cursor-pointer focus:ring-0 accent-black checked:bg-black checked:border-black appearance-none shrink-0 relative transition-colors checked:after:content-[''] checked:after:block checked:after:w-full checked:after:h-full checked:after:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%224%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%2220 6 9 17 4 12%22/></svg>')] checked:after:bg-center checked:after:bg-no-repeat checked:after:bg-[length:12px_12px]"
      />
      <span
        className={cn(
          "text-sm text-neutral-700 transition-colors group-hover/opt:text-black",
          checked ? "font-semibold text-black" : "font-medium"
        )}
      >
        {label}
      </span>
    </label>
  );
}

export default function GridSidebar({
  categories,
  selected,
  onChange,
  className = "",
  showMobile = true,
}: GridSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();

  const content = (
    <div className="space-y-0.5">
      {categories.map((cat) => (
        <CategoryRow
          key={cat}
          checked={selected === cat}
          label={cat}
          onToggle={() => onChange(cat)}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile: collapsible toggle above grid */}
      {showMobile && (
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-between w-full px-4 py-3"
          >
            <span className="text-[13px] font-semibold uppercase tracking-wider text-gray-600">
              Category
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
            <div className="px-2 py-2 border-t border-gray-200">
              {content}
            </div>
          )}
        </div>
      )}

      {/* Desktop: fixed-width sidebar column */}
      <div className={cn("py-4", className)}>
        <p className="text-[13px] font-semibold uppercase tracking-wider text-gray-600 mb-3 px-3">
          Category
        </p>
        {content}
      </div>
    </>
  );
}