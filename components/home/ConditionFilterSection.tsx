"use client";

import { useState } from "react";
import ConditionFilterBar from "./ConditionFilterBar";
import CategoryGrid from "./CategoryGrid";

export default function ConditionFilterSection() {
  const [condition, setCondition] = useState<"new" | "preloved">("new");

  return (
    <>
      <ConditionFilterBar condition={condition} onChange={setCondition} />
      <CategoryGrid condition={condition} />
    </>
  );
}
