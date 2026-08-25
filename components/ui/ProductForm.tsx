"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MultiImageUpload from "@/components/ui/MultiImageUpload";

const CONDITION_GRADES = ["", "MINT", "EXCELLENT", "GOOD", "FAIR"];

type ProductFormData = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  condition: string;
  conditionGrade: string | null;
  conditionNotes: string | null;
  includedAccessories: string[];
  shutterCount: number | null;
  mount: string | null;
  format: string | null;
  description: string;
  categoryId: string;
  images: string[];
  stockQuantity: number;
};

interface ProductFormProps {
  categories: { id: string; name: string }[];
  initialData?: ProductFormData;
}

const shakeVariants = {
  shake: {
    x: [0, -6, 6, -6, 6, -3, 3, 0],
    transition: { duration: 0.35 },
  },
};

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [price, setPrice] = useState(initialData ? String(initialData.price) : "");
  const [condition, setCondition] = useState<"new" | "preloved">(
    (initialData?.condition as "new" | "preloved") ?? "new"
  );
  const [conditionGrade, setConditionGrade] = useState(initialData?.conditionGrade ?? "");
  const [conditionNotes, setConditionNotes] = useState(initialData?.conditionNotes ?? "");
  const [includedAccessories, setIncludedAccessories] = useState(
    initialData?.includedAccessories?.join(", ") ?? ""
  );
  const [shutterCount, setShutterCount] = useState(initialData?.shutterCount ? String(initialData.shutterCount) : "");
  const [mount, setMount] = useState(initialData?.mount ?? "");
  const [format, setFormat] = useState(initialData?.format ?? "");
  const [stockQty, setStockQty] = useState(initialData ? String(initialData.stockQuantity) : "1");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? categories[0]?.id ?? "");
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const triggerShake = () => setShakeKey((k) => k + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !slug || !brand || !price || !description || !categoryId) {
      triggerShake();
      setError("Please fill in all required fields.");
      return;
    }

    if (images.length === 0) {
      triggerShake();
      setError("Please upload at least one image.");
      return;
    }

    setStatus("loading");

    const method = isEditing ? "PATCH" : "POST";
    const url = isEditing ? `/api/products/${initialData!.id}` : "/api/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        brand,
        price: parseFloat(price),
        condition,
        conditionGrade: condition === "preloved" ? conditionGrade || null : null,
        conditionNotes: condition === "preloved" ? conditionNotes || null : null,
        includedAccessories: includedAccessories
          ? includedAccessories.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        shutterCount: shutterCount ? parseInt(shutterCount, 10) : null,
        mount: mount || null,
        format: format || null,
        stockQuantity: parseInt(stockQty, 10) || 1,
        description,
        categoryId,
        images,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create product");
      triggerShake();
      setStatus("idle");
      return;
    }

    setStatus("success");
    setTimeout(() => router.push("/admin/products"), 400);
  };

  const submitLabel = isEditing ? "Update Product" : "Create Product";
  const loadingLabel = isEditing ? "Updating..." : "Creating...";
  const successLabel = isEditing ? "Updated!" : "Created!";

  const isPreloved = condition === "preloved";

  return (
    <motion.form
      key={shakeKey}
      variants={shakeVariants}
      animate={error ? "shake" : undefined}
      onSubmit={handleSubmit}
      className="max-w-lg flex flex-col gap-5"
    >
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors"
          required
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors"
          required
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Brand
        </label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors"
          required
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Price ($)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors"
          required
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Condition
        </label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as "new" | "preloved")}
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white"
        >
          <option value="new">New</option>
          <option value="preloved">Preloved</option>
        </select>
      </div>

      {isPreloved && (
        <>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
              Condition Grade
            </label>
            <select
              value={conditionGrade}
              onChange={(e) => setConditionGrade(e.target.value)}
              className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white"
            >
              {CONDITION_GRADES.map((g) => (
                <option key={g} value={g}>
                  {g || "Select grade"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
              Condition Notes
            </label>
            <textarea
              rows={3}
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
              Shutter Count
            </label>
            <input
              type="number"
              min="0"
              value={shutterCount}
              onChange={(e) => setShutterCount(e.target.value)}
              className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors"
            />
          </div>
        </>
      )}

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Mount
        </label>
        <input
          type="text"
          value={mount}
          onChange={(e) => setMount(e.target.value)}
          placeholder="e.g. Canon EF, Leica M, Sony E"
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Format
        </label>
        <input
          type="text"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          placeholder="e.g. 35mm Full Frame, Medium Format, APS-C"
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Included Accessories (comma-separated)
        </label>
        <input
          type="text"
          value={includedAccessories}
          onChange={(e) => setIncludedAccessories(e.target.value)}
          placeholder="Original box, Strap, Lens cap"
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white"
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Stock Quantity
        </label>
        <input
          type="number"
          min="0"
          value={stockQty}
          onChange={(e) => setStockQty(e.target.value)}
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
          Description
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A] transition-colors resize-none"
          required
        />
      </div>

      <MultiImageUpload images={images} onChange={setImages} />

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status !== "idle"}
        className="w-full bg-[#1A1A1A] text-white text-sm font-medium py-3 tracking-wide hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading"
          ? loadingLabel
          : status === "success"
            ? successLabel
            : submitLabel}
      </button>
    </motion.form>
  );
}
