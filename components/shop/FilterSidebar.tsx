"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus, Package, BadgeCheck, BadgeDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion, materialEase } from "@/lib/motion";

interface Props {
  brands: string[];
  hideCondition?: boolean;
}

const priceRanges = [
  { label: "Under RM500", min: null, max: "500" },
  { label: "RM500–RM1000", min: "500", max: "1000" },
  { label: "RM1000–RM3000", min: "1000", max: "3000" },
  { label: "RM3000–RM6000", min: "3000", max: "6000" },
  { label: "Over RM6000", min: "6000", max: null },
] as const;

const accordionVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.3, ease: materialEase },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.25, ease: materialEase },
  },
};

function Section({
  icon: Icon,
  title,
  open,
  onToggle,
  children,
  footerTight = false,
  reduced,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  footerTight?: boolean;
  reduced: boolean;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="flex items-center gap-3">
          <Icon className="w-[18px] h-[18px] text-neutral-400 group-hover:text-black transition-colors" />
          <span className="text-[15px] font-semibold text-neutral-900 tracking-tight">
            {title}
          </span>
        </span>
        {open ? (
          <Minus className="w-4 h-4 stroke-[2.5px] text-neutral-400" />
        ) : (
          <Plus className="w-4 h-4 stroke-[2.5px] text-neutral-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            variants={reduced ? undefined : accordionVariants}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : "visible"}
            exit={reduced ? undefined : "exit"}
            className="overflow-hidden"
          >
            <div className={cn("pb-6", footerTight && "pb-5")}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptionCheckbox({
  checked,
  label,
  onToggle,
  activeBold,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
  activeBold?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 py-2.5 px-2 -mx-2 cursor-pointer group/opt transition-colors duration-150 hover:bg-neutral-50 rounded-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-[18px] h-[18px] border-2 border-neutral-300 rounded-[3px] cursor-pointer focus:ring-0 accent-black checked:bg-black checked:border-black appearance-none shrink-0 relative transition-colors checked:after:content-[''] checked:after:block checked:after:w-full checked:after:h-full checked:after:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%224%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%2220 6 9 17 4 12%22/></svg>')] checked:after:bg-center checked:after:bg-no-repeat checked:after:bg-[length:12px_12px]"
      />
      <span
        className={cn(
          "text-sm text-neutral-700 transition-colors group-hover/opt:text-black",
          activeBold ? "font-semibold text-black" : "font-medium"
        )}
      >
        {label}
      </span>
    </label>
  );
}

export default function FilterSidebar({ brands, hideCondition }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();

  const [brandOpen, setBrandOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);

  const currentMin = searchParams.get("minPrice") || "";
  const currentMax = searchParams.get("maxPrice") || "";
  const currentBrands = (searchParams.get("brand") || "").split(",").filter(Boolean);
  const currentCondition = searchParams.get("condition") || "";
  const currentSubcategory = searchParams.get("subcategory") || "";

  const buildUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams]
  );

  const toggleBrand = (brand: string) => {
    const exists = currentBrands.some((b) => b.toLowerCase() === brand.toLowerCase());
    const next = exists
      ? currentBrands.filter((b) => b.toLowerCase() !== brand.toLowerCase())
      : [...currentBrands, brand];
    router.push(buildUrl({ brand: next.length ? next.join(",") : null }));
  };

  const setCondition = (cond: string) => {
    router.push(buildUrl({ condition: currentCondition === cond ? null : cond }));
  };

  const setPriceRange = (min: string | null, max: string | null) => {
    const isActive = currentMin === (min || "") && currentMax === (max || "");
    router.push(buildUrl({ minPrice: isActive ? null : min, maxPrice: isActive ? null : max }));
  };

  const filterCount = [
    hideCondition ? null : currentCondition,
    currentBrands.length > 0 ? "brand" : null,
    currentMin || currentMax ? "price" : null,
    currentSubcategory ? "subcategory" : null,
  ].filter(Boolean).length;

  const activePriceIndex = priceRanges.findIndex(
    (r) => currentMin === (r.min || "") && currentMax === (r.max || "")
  );

  return (
    <div>
      <div className="flex items-center mb-8">
        <span className="text-[22px] font-bold text-black tracking-tight">Filters</span>
        {filterCount > 0 && (
          <span className="flex items-center justify-center w-6 h-6 rounded-full border border-black text-[13px] font-medium ml-2">
            {filterCount}
          </span>
        )}
      </div>

      <Section
        icon={Package}
        title="Brand"
        open={brandOpen}
        onToggle={() => setBrandOpen(!brandOpen)}
        reduced={reduced}
      >
        {brands.length > 0 &&
          brands.map((brand) => (
            <OptionCheckbox
              key={brand}
              checked={currentBrands.some((b) => b.toLowerCase() === brand.toLowerCase())}
              label={brand}
              onToggle={() => toggleBrand(brand)}
              activeBold={currentBrands.some((b) => b.toLowerCase() === brand.toLowerCase())}
            />
          ))}
      </Section>

      {!hideCondition && (
        <Section
          icon={BadgeCheck}
          title="Condition"
          open={conditionOpen}
          onToggle={() => setConditionOpen(!conditionOpen)}
          reduced={reduced}
        >
          {["new", "preloved"].map((cond) => (
            <OptionCheckbox
              key={cond}
              checked={currentCondition === cond}
              label={cond === "new" ? "New" : "Preloved"}
              onToggle={() => setCondition(cond)}
              activeBold={currentCondition === cond}
            />
          ))}
        </Section>
      )}

      <Section
        icon={BadgeDollarSign}
        title="Price"
        open
        onToggle={() => {}}
        reduced={reduced}
      >
        {priceRanges.map((range, i) => (
          <OptionCheckbox
            key={i}
            checked={activePriceIndex === i}
            label={range.label}
            onToggle={() => setPriceRange(range.min, range.max)}
            activeBold={activePriceIndex === i}
          />
        ))}
      </Section>
    </div>
  );
}
