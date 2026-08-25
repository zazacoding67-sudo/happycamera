"use client";

interface SortSelectProps {
  defaultValue?: string;
}

export default function SortSelect({ defaultValue }: SortSelectProps) {
  return (
    <select
      name="sort"
      defaultValue={defaultValue ?? ""}
      onChange={(e) => {
        const form = e.currentTarget.closest("form") as HTMLFormElement;
        form?.requestSubmit();
      }}
      className="text-[11px] font-medium uppercase tracking-[0.1em] border border-[#D8D8D8] px-3 py-2 bg-white text-[#666] hover:text-black rounded-none focus:outline-none cursor-pointer transition-colors"
    >
      <option value="">Sort by Relevance</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="newest">Newest First</option>
    </select>
  );
}
