"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";

export default function UploadProductsPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    created: number;
    createdNames: string[];
    errors: number;
    errorDetails: { row: number; message: string }[];
  } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError("");
    setResult(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/products/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
      } else {
        setResult(data);
        if (data.created > 0) router.refresh();
      }
    } catch {
      setError("Network error.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs text-gray-400 mb-1">
          <Link href="/admin" className="hover:text-gray-600 transition-colors">
            Admin
          </Link>
          {" / "}
          <Link href="/admin/products" className="hover:text-gray-600 transition-colors">
            Products
          </Link>
          {" / Bulk Upload"}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Bulk Upload Products
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Upload a CSV file to create or update products in bulk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
            {!file ? (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-[var(--color-border)] p-12 text-center cursor-pointer hover:border-[var(--color-accent)] transition-colors"
              >
                <Upload size={32} className="mx-auto text-[var(--color-text-secondary)] mb-3" />
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  Click to select CSV file
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Comma-separated values with header row
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[var(--color-bg)] p-4 border border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-[var(--color-text-secondary)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{file.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                    }}
                    className="text-xs text-[var(--color-text-secondary)] hover:text-red-500 transition-colors underline"
                  >
                    Remove
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium tracking-wide transition-colors bg-[var(--color-accent)] text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setResult(null);
                setError("");
              }}
            />
          </form>

          {error && (
            <div className="mt-4 flex items-start gap-2 p-4 bg-red-50 border border-red-200">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 space-y-3">
              {result.created > 0 && (
                <div className="flex items-start gap-2 p-4 bg-green-50 border border-green-200">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {result.created} product(s) created / updated
                    </p>
                    <p className="text-xs text-green-600 mt-1">{result.createdNames.join(", ")}</p>
                  </div>
                </div>
              )}
              {result.errors > 0 && (
                <div className="p-4 bg-red-50 border border-red-200">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    {result.errors} error(s)
                  </p>
                  <ul className="space-y-1">
                    {result.errorDetails.map((e, i) => (
                      <li key={i} className="text-xs text-red-600">
                        Row {e.row}: {e.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 h-fit">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">
            CSV Format
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mb-4">
            The CSV must include a header row with these columns:
          </p>
          <ul className="space-y-1 text-[11px] font-mono text-[var(--color-text-secondary)]">
            <li><span className="text-[var(--color-accent)]">name</span> *</li>
            <li><span className="text-[var(--color-accent)]">slug</span> *</li>
            <li><span className="text-[var(--color-accent)]">brand</span> *</li>
            <li><span className="text-[var(--color-accent)]">price</span> *</li>
            <li><span className="text-[var(--color-accent)]">condition</span> * (new / preloved)</li>
            <li><span className="text-[var(--color-accent)]">categorySlug</span> *</li>
            <li><span className="text-[var(--color-accent)]">subcategory</span> (optional, must match categorySlug)</li>
            <li>description</li>
            <li>stockQuantity</li>
            <li>conditionGrade</li>
            <li>conditionNotes</li>
            <li>includedAccessories</li>
            <li>shutterCount</li>
            <li>mount</li>
            <li>format</li>
            <li>warranty</li>
          </ul>
          <p className="text-xs text-[var(--color-text-secondary)] mt-4">
            * Required fields. Products with existing slugs will be updated.
          </p>
        </div>
      </div>
    </div>
  );
}
