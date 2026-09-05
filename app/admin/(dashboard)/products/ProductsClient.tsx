"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  condition: string;
  stockQuantity: number;
  images: string[];
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, visible: true });
  };

  const filtered = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteTarget(null);
      showToast(`"${deleteTarget.name}" deleted.`, "success");
      router.refresh();
    } else {
      setDeleteTarget(null);
      showToast("Failed to delete product.", "error");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Manage Products
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {products.length} product(s) total
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[var(--color-border)] px-3 py-2.5 text-base sm:text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors bg-[var(--color-surface)] rounded-none"
            />
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/products/upload"
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium tracking-wide transition-colors border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)]"
            >
              Bulk Upload
            </Link>
            <Link
              href="/admin/products/new"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium tracking-wide transition-colors bg-yellow-400 text-black hover:bg-yellow-300"
            >
              <Plus size={15} />
              Add New Product
            </Link>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {search ? `No products matching "${search}".` : "No products yet."}
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-[var(--color-surface)] border border-[var(--color-border)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <Th>Image</Th>
                  <Th>Name</Th>
                  <Th>Price</Th>
                  <Th>Condition</Th>
                  <Th>Stock</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors"
                  >
                    <td className="py-3 px-4">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100" />
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-[var(--color-text-primary)] max-w-[200px] truncate">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                        {product.condition === "new" ? "New" : "Preloved"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StockBadge qty={product.stockQuantity} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-[var(--color-text-secondary)] hover:text-yellow-600 hover:bg-yellow-50 transition-colors rounded-sm"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                          className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50 transition-colors rounded-sm"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4"
              >
                <div className="flex items-start gap-4">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                      {formatPrice(product.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                        {product.condition === "new" ? "New" : "Preloved"}
                      </span>
                      <StockBadge qty={product.stockQuantity} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border)]">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-yellow-600 hover:border-yellow-400 transition-colors rounded-none"
                  >
                    <Pencil size={13} />
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors rounded-none"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name || ""}"?`}
        message="This cannot be undone. The product will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
}

function StockBadge({ qty }: { qty: number }) {
  const color =
    qty <= 1
      ? "bg-red-50 text-red-700 border-red-200"
      : qty <= 3
        ? "bg-orange-50 text-orange-700 border-orange-200"
        : "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <span
      className={cn(
        "text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border",
        color
      )}
    >
      {qty <= 3 ? `${qty} left` : qty}
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
      {children}
    </th>
  );
}
