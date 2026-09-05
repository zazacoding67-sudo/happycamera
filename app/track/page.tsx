"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Package, Search, CheckCircle2, Clock, Truck, XCircle, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { usePolling } from "@/lib/usePolling";

interface OrderItem {
  name: string;
  imageUrl: string | null;
  slug: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  orderNumber: string | null;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  courierName: string | null;
  trackingNumber: string | null;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  PENDING: { label: "Pending", icon: Clock, color: "text-zinc-400" },
  PAID: { label: "Paid", icon: CheckCircle2, color: "text-green-600" },
  PROCESSING: { label: "Processing", icon: Package, color: "text-yellow-500" },
  SHIPPED: { label: "Shipped", icon: Truck, color: "text-yellow-500" },
  DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "text-green-600" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-red-500" },
};

const STATUS_ORDER = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState("");

  const lookupOrder = useCallback(async (orderId: string, email: string) => {
    const res = await fetch(
      `/api/track?orderId=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(email.trim())}`
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "We couldn't find that order.");
    }
    return res.json();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!orderId.trim() || !email.trim()) return;

      setLoading(true);
      setOrder(null);
      setError("");

      try {
        const data = await lookupOrder(orderId, email);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [orderId, email, lookupOrder]
  );

  const terminal = order?.status === "DELIVERED" || order?.status === "CANCELLED";

  usePolling(
    async () => {
      if (!orderId.trim() || !email.trim()) return;
      try {
        const data = await lookupOrder(orderId, email);
        setOrder(data);
      } catch {
        // Keep the last known status while polling.
      }
    },
    30_000,
    order !== null && !terminal
  );

  const currentIdx = order ? STATUS_ORDER.indexOf(order.status) : -1;
  const cancelled = order?.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-xl mb-12">
          <span className="text-[11px] tracking-[0.25em] uppercase text-yellow-500 font-medium">
            Order Tracking
          </span>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900 leading-tight mt-4">
            Where&rsquo;s your gear?
          </h1>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            Enter your order number and email to check the status of your order.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-12">
          <div>
            <label htmlFor="orderId" className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 block mb-2">
              Order Number
            </label>
            <input
              id="orderId"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. HC-7X2K9M1Q"
              className="w-full border border-zinc-200 px-4 py-3 text-base sm:text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-none"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 block mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-zinc-200 px-4 py-3 text-base sm:text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors rounded-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderId.trim() || !email.trim()}
            className="flex items-center justify-center gap-2 w-full bg-zinc-900 text-white text-sm font-medium px-6 py-3.5 rounded-none hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={16} />
            )}
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && (
          <div className="border border-zinc-200 p-6 text-center">
            <AlertCircle size={28} className="mx-auto text-zinc-300 mb-3" />
            <p className="text-sm text-zinc-600">{error}</p>
            <p className="text-xs text-zinc-400 mt-1">
              Double-check your order number and email, or contact us at hello@happycamera.com.my
            </p>
          </div>
        )}

        {order && (
          <div className="space-y-8">
            <div className="border border-zinc-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
                    Order
                  </p>
                  <p className="text-sm font-medium text-zinc-900 mt-0.5 font-mono">
                    {order.orderNumber ?? order.id.slice(0, 8)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
                    Status
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-1 text-sm font-medium text-zinc-900">
                    {(() => {
                      const cfg = STATUS_CONFIG[order.status];
                      const Icon = cfg?.icon ?? AlertCircle;
                      return (
                        <>
                          <Icon size={14} className={cfg?.color ?? ""} />
                          {cfg?.label ?? order.status}
                        </>
                      );
                    })()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-400">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {!terminal && (
              <div className="flex items-center justify-end">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Auto-refreshing
                </span>
              </div>
            )}

            {cancelled ? (
              <div className="border border-red-100 bg-red-50 p-6 text-center">
                <XCircle size={28} className="mx-auto text-red-400 mb-2" />
                <p className="text-sm font-medium text-red-800">This order has been cancelled.</p>
              </div>
            ) : (
              <div className="border border-zinc-200 p-6">
                <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium mb-5">
                  Progress
                </p>
                <div className="flex items-center gap-0">
                  {STATUS_ORDER.map((s, i) => {
                    const cfg = STATUS_CONFIG[s];
                    const Icon = cfg.icon;
                    const active = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    return (
                      <div key={s} className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all ${
                            active
                              ? "border-yellow-400 bg-yellow-400 text-zinc-900"
                              : "border-zinc-200 bg-white text-zinc-300"
                          } ${isCurrent ? "ring-2 ring-yellow-400/30" : ""}`}
                        >
                          <Icon size={14} />
                        </div>
                        <p
                          className={`text-[10px] font-medium uppercase tracking-wider mt-1.5 ${
                            active ? "text-zinc-900" : "text-zinc-300"
                          }`}
                        >
                          {cfg.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {order.status === "SHIPPED" && order.courierName && (
              <div className="border border-zinc-200 p-6">
                <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium mb-2">
                  Courier
                </p>
                <p className="text-sm font-medium text-zinc-900">{order.courierName}</p>
                {order.trackingNumber && (
                  <p className="text-sm text-zinc-600 mt-0.5 font-mono">{order.trackingNumber}</p>
                )}
              </div>
            )}

            <div className="border border-zinc-200 divide-y divide-zinc-100">
              <div className="px-6 py-3">
                <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
                  Items
                </p>
              </div>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-14 h-14 bg-zinc-50 shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[10px]">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-medium text-zinc-900 hover:underline truncate block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-zinc-400">
                      x{item.quantity} &middot; {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-zinc-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between px-6 py-4 bg-zinc-50">
                <p className="text-sm font-medium text-zinc-900">Total</p>
                <p className="text-sm font-bold text-zinc-900">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
