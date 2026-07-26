"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

interface Props {
  orderId: string;
  currentStatus: string;
  currentCourier: string;
  currentTracking: string;
}

const inputBase =
  "w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors bg-[var(--color-surface)] rounded-none";
const labelBase =
  "text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]";

export default function OrderDetailClient({
  orderId,
  currentStatus,
  currentCourier,
  currentTracking,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [courier, setCourier] = useState(currentCourier);
  const [tracking, setTracking] = useState(currentTracking);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showingBlockedHint, setShowingBlockedHint] = useState(false);

  const trackingChanged =
    tracking !== currentTracking || courier !== currentCourier;

  // Always show hint when SHIPPED is disabled (no tracking), regardless of active status
  useEffect(() => {
    setShowingBlockedHint(!tracking.trim());
  }, [tracking]);

  const canShip = status !== "SHIPPED" || (status === "SHIPPED" && tracking.trim());

  const handleSave = async () => {
    if (status === "SHIPPED" && !tracking.trim()) {
      setShowingBlockedHint(true);
      return;
    }

    setSaving(true);
    setSaveError("");

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        courierName: courier,
        trackingNumber: tracking,
        // Signal to the API that tracking was edited after shipping
        trackingEdited: trackingChanged && currentStatus === "SHIPPED",
      }),
    });

    setSaving(false);

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      setSaveError(data.error || "Failed to save changes.");
    }
  };

  const courierUrl =
    courier && tracking
      ? ({
          "j&t": `https://www.jtexpress.my/tracking/${tracking}`,
          "poslaju": `https://www.pos.com.my/postal-services/quick-access/?track-tracker=${tracking}`,
          "city-link": `https://www.citylinkexpress.com/tracking/${tracking}`,
        }[courier.toLowerCase()] || null)
      : null;

  const isAlreadyShipped = currentStatus === "SHIPPED";

  return (
    <div className="space-y-6">
      <div>
        <h3 className={labelBase + " mb-3"}>Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => {
            const isDisabled = s === "SHIPPED" && !tracking.trim();
            return (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  setShowingBlockedHint(false);
                }}
                disabled={isDisabled}
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 border transition-colors",
                  status === s
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-yellow-400",
                  isDisabled && "opacity-30 cursor-not-allowed"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        {showingBlockedHint && (
          <p className="text-xs text-yellow-600 mt-2">
            Add a tracking number first before marking as shipped.
          </p>
        )}
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-2 mb-5">
          <Truck size={16} className="text-[var(--color-text-secondary)]" />
          <h3 className={labelBase}>Shipping</h3>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelBase}>Courier Name</label>
            <input
              type="text"
              placeholder="e.g. J&T, PosLaju, City-Link"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className={inputBase + " mt-1.5"}
            />
          </div>
          <div>
            <label className={labelBase}>Tracking Number</label>
            <input
              type="text"
              placeholder="Enter tracking number"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              className={inputBase + " mt-1.5"}
            />
            {isAlreadyShipped && trackingChanged && (
              <p className="text-xs text-yellow-600 mt-1.5">
                Tracking changed — a &ldquo;Updated Tracking&rdquo; email will be sent on save.
              </p>
            )}
          </div>
          {courierUrl && (
            <a
              href={courierUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
            >
              Track on {courier}&rsquo;s site
            </a>
          )}
        </div>
      </div>

      {saveError && (
        <p className="text-sm text-red-500">{saveError}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-yellow-400 text-black text-sm font-semibold px-6 py-2.5 tracking-wide hover:bg-yellow-300 transition-colors disabled:opacity-60 rounded-none"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
