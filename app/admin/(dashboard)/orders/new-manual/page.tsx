"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Toast from "@/components/ui/Toast";

const sectionHeader =
  "text-xs font-semibold tracking-widest text-gray-400 uppercase";
const inputBase =
  "w-full border border-[var(--color-border)] px-3 py-2.5 text-base sm:text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors bg-[var(--color-surface)] rounded-none";
const inputError = "ring-2 ring-red-400 focus:ring-red-500";
const labelBase =
  "text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]";
const cardBase =
  "bg-[var(--color-surface)] border border-[var(--color-border)] p-6";

function validate(errors: Record<string, string>, form: {
  customerName: string;
  customerEmail: string;
  itemsDescription: string;
  totalAmount: string;
  courierName: string;
  trackingNumber: string;
}) {
  if (!form.customerName.trim()) errors.customerName = "Customer name is required.";
  if (!form.customerEmail.trim()) errors.customerEmail = "Customer email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail))
    errors.customerEmail = "Enter a valid email address.";
  if (!form.itemsDescription.trim()) errors.itemsDescription = "Item(s) sold is required.";
  const amount = parseFloat(form.totalAmount);
  if (!form.totalAmount || isNaN(amount) || amount <= 0)
    errors.totalAmount = "Enter a valid amount greater than 0.";
  else if (amount > 999_999) errors.totalAmount = "Amount seems unreasonably high (max RM 999,999).";
  if (!form.courierName.trim()) errors.courierName = "Courier name is required.";
  if (!form.trackingNumber.trim()) errors.trackingNumber = "Tracking number is required.";
}

export default function NewManualOrderPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [itemsDescription, setItemsDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, visible: true });
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const inpClass = (field: string) =>
    cn(inputBase, fieldErrors[field] && inputError);
  const errMsg = (field: string) =>
    fieldErrors[field] ? (
      <p className="text-xs text-red-500 mt-1">{fieldErrors[field]}</p>
    ) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    validate(errors, {
      customerName,
      customerEmail,
      itemsDescription,
      totalAmount,
      courierName,
      trackingNumber,
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/orders/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim() || null,
          shippingAddress: shippingAddress.trim() || null,
          itemsDescription: itemsDescription.trim(),
          totalAmount: parseFloat(totalAmount),
          courierName: courierName.trim(),
          trackingNumber: trackingNumber.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fields) {
          setFieldErrors(data.fields);
        }
        setError(data.error || "Failed to create order.");
        setStatus("idle");
        return;
      }

      showToast("Order created and tracking email sent!", "success");
      setTimeout(() => router.push(`/admin/orders/${data.id}`), 800);
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="p-8">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />

      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Orders
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Log External Order
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Record an order placed via WhatsApp, Carousell, or other channels. A tracking email will be sent immediately.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <div className={cardBase}>
              <p className={sectionHeader}>Customer</p>
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <label className={labelBase}>Customer Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      clearFieldError("customerName");
                    }}
                    className={`mt-1.5 ${inpClass("customerName")}`}
                  />
                  {errMsg("customerName")}
                </div>
                <div>
                  <label className={labelBase}>Customer Email *</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      clearFieldError("customerEmail");
                    }}
                    className={`mt-1.5 ${inpClass("customerEmail")}`}
                  />
                  {errMsg("customerEmail")}
                </div>
                <div>
                  <label className={labelBase}>Customer Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      clearFieldError("customerPhone");
                    }}
                    className={`mt-1.5 ${inputBase}`}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className={cardBase}>
              <p className={sectionHeader}>Items &amp; Pricing</p>
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <label className={labelBase}>Item(s) Sold *</label>
                  <textarea
                    rows={3}
                    value={itemsDescription}
                    onChange={(e) => {
                      setItemsDescription(e.target.value);
                      clearFieldError("itemsDescription");
                    }}
                    placeholder='e.g. "Canon EOS R50 (used) x1, 32GB SD card x1"'
                    className={`mt-1.5 resize-none ${inpClass("itemsDescription")}`}
                  />
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Freeform description — not linked to the product catalog.
                  </p>
                  {errMsg("itemsDescription")}
                </div>
                <div>
                  <label className={labelBase}>Total Amount (RM) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={totalAmount}
                    onChange={(e) => {
                      setTotalAmount(e.target.value);
                      clearFieldError("totalAmount");
                    }}
                    className={`mt-1.5 ${inpClass("totalAmount")}`}
                  />
                  {errMsg("totalAmount")}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className={cardBase}>
              <p className={sectionHeader}>Shipping</p>
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <label className={labelBase}>Shipping Address</label>
                  <textarea
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Full shipping address (optional)"
                    className={`mt-1.5 resize-none ${inputBase}`}
                  />
                </div>
                <div>
                  <label className={labelBase}>Courier Name *</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => {
                      setCourierName(e.target.value);
                      clearFieldError("courierName");
                    }}
                    placeholder="e.g. J&T Express, PosLaju"
                    className={`mt-1.5 ${inpClass("courierName")}`}
                  />
                  {errMsg("courierName")}
                </div>
                <div>
                  <label className={labelBase}>Tracking Number *</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => {
                      setTrackingNumber(e.target.value);
                      clearFieldError("trackingNumber");
                    }}
                    placeholder="Enter tracking number"
                    className={`mt-1.5 ${inpClass("trackingNumber")}`}
                  />
                  {errMsg("trackingNumber")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-8">
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full md:w-auto bg-yellow-400 text-black text-sm font-semibold px-8 py-3 tracking-wide hover:bg-yellow-300 transition-colors disabled:opacity-60 rounded-none"
          >
            {status === "loading" ? "Creating..." : "Log External Order & Send Email"}
          </button>
        </div>
      </form>
    </div>
  );
}
