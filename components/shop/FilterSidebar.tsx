"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function FilterSidebar({ brands, hideCondition }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [brandOpen, setBrandOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);

  const currentMin = searchParams.get("minPrice") || "";
  const currentMax = searchParams.get("maxPrice") || "";
  const currentBrands = (searchParams.get("brand") || "").split(",").filter(Boolean);
  const currentCondition = searchParams.get("condition") || "";

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
  ].filter(Boolean).length;

  const activePriceIndex = priceRanges.findIndex(
    (r) => currentMin === (r.min || "") && currentMax === (r.max || "")
  );

  return (
    <div>
      <div className="flex items-center mb-8">
        <span className="text-2xl font-bold text-black tracking-tight">Filters</span>
        {filterCount > 0 && (
          <span className="flex items-center justify-center w-6 h-6 rounded-full border border-black text-[13px] font-medium ml-2">
            {filterCount}
          </span>
        )}
      </div>

      <div className="border-b border-gray-200 mb-6">
        <button
          onClick={() => setBrandOpen(!brandOpen)}
          className="flex items-center justify-between w-full py-4 text-lg font-bold text-black tracking-tight"
        >
          Brand
          {brandOpen ? <Minus className="w-5 h-5 stroke-[2px] text-gray-500" /> : <Plus className="w-5 h-5 stroke-[2px] text-gray-500" />}
        </button>
        {brandOpen && brands.length > 0 && (
          <div className="pb-6">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={currentBrands.some((b) => b.toLowerCase() === brand.toLowerCase())}
                  onChange={() => toggleBrand(brand)}
                  className="w-6 h-6 border-2 border-gray-300 rounded-none cursor-pointer focus:ring-0 checked:bg-black checked:border-black"
                />
                <span className="text-base font-medium text-black ml-4">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {!hideCondition && (
        <div className="border-b border-gray-200 mb-6">
          <button
            onClick={() => setConditionOpen(!conditionOpen)}
            className="flex items-center justify-between w-full py-4 text-lg font-bold text-black tracking-tight"
          >
            Condition
            {conditionOpen ? <Minus className="w-5 h-5 stroke-[2px] text-gray-500" /> : <Plus className="w-5 h-5 stroke-[2px] text-gray-500" />}
          </button>
          {conditionOpen && (
            <div className="pb-6">
              {["new", "preloved"].map((cond) => (
                <label
                  key={cond}
                  className={cn(
                    "flex items-center py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={currentCondition === cond}
                    onChange={() => setCondition(cond)}
                    className="w-6 h-6 border-2 border-gray-300 rounded-none cursor-pointer focus:ring-0 checked:bg-black checked:border-black"
                  />
                  <span className={cn(
                    "text-base font-medium text-black ml-4",
                    currentCondition === cond && "font-bold"
                  )}>
                    {cond === "new" ? "New" : "Preloved"}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="border-b border-gray-200 mb-6">
        <p className="py-4 text-lg font-bold text-black tracking-tight">Price</p>
        <div className="pb-6">
          {priceRanges.map((range, i) => (
            <label
              key={i}
              className="flex items-center py-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={activePriceIndex === i}
                onChange={() => setPriceRange(range.min, range.max)}
                className="w-6 h-6 border-2 border-gray-300 rounded-none cursor-pointer focus:ring-0 checked:bg-black checked:border-black"
              />
              <span className="text-base font-medium text-black ml-4">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
