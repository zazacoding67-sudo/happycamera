"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle2, Truck, XCircle, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { usePolling } from "@/lib/usePolling";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string | null;
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
  SHIPPED: { label: "Shipped", icon: Truck, color: "text-blue-600" },
  DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "text-green-600" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-red-500" },
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders/customer");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      // Keep the last known order list.
    } finally {
      setLoading(false);
    }
  }, [router]);

  usePolling(loadOrders, 60_000, !!session?.user?.id);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex items-center justify-center py-20">
            <span className="w-5 h-5 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex items-start justify-between max-w-xl mb-12">
          <div>
            <span className="text-[11px] tracking-[0.25em] uppercase text-yellow-500 font-medium">
              Your Account
            </span>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900 leading-tight mt-4">
              Order History
            </h1>
            <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
              Welcome back, {session.user?.name || "there"}. Here are your past orders.
            </p>
          </div>
          {orders.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-zinc-400 mt-1 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Auto-refreshing
            </span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="border border-zinc-200 p-12 text-center">
            <Package size={32} className="mx-auto text-zinc-300 mb-3" />
            <p className="text-sm font-medium text-zinc-900">No orders yet</p>
            <p className="text-xs text-zinc-400 mt-1">
              Your order history will appear here once you make a purchase.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-yellow-600 transition-colors"
            >
              Browse Gear <ExternalLink size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              const Icon = cfg?.icon ?? Package;
              return (
                <div key={order.id} className="border border-zinc-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
                        Order
                      </p>
                      <p className="text-sm font-medium text-zinc-900 mt-0.5 font-mono">
                        {order.orderNumber ?? `${order.id.slice(0, 12)}...`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon size={14} className={cfg?.color ?? ""} />
                      <span className="text-sm font-medium text-zinc-900">
                        {cfg?.label ?? order.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">
                    {new Date(order.createdAt).toLocaleDateString("en-MY", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-sm font-semibold text-zinc-900">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <Link
                    href={`/track`}
                    className="inline-flex items-center gap-1 mt-3 text-xs text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors"
                  >
                    Track Order
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
