"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { usePolling } from "@/lib/usePolling";
import RevenueChart from "@/components/admin/RevenueChart";
import type { AdminMetrics } from "@/lib/adminMetrics";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function DashboardClient({
  initial,
}: {
  initial: AdminMetrics;
}) {
  const [metrics, setMetrics] = useState<AdminMetrics>(initial);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/metrics", { cache: "no-store" });
      if (!res.ok) return;
      setMetrics(await res.json());
    } catch {
      // Keep the last known metrics.
    }
  }, []);

  usePolling(load, 60_000);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Store overview at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Products"
          value={metrics.productCount}
          accent="border-l-[var(--color-accent)]"
        />
        <MetricCard
          label="Orders"
          value={metrics.orderCount}
          accent="border-l-blue-500"
        />
        <MetricCard
          label="Revenue"
          value={formatPrice(metrics.totalRevenue)}
          accent="border-l-green-500"
        />
        <MetricCard
          label="Pending Orders"
          value={metrics.pendingOrders}
          accent="border-l-amber-500"
        />
      </div>

      <RevenueChart
        dailyRevenue={metrics.dailyRevenue}
        topProducts={metrics.topProducts}
      />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-base font-bold tracking-tight text-[var(--color-text-primary)] mb-4">
            Recent Orders
          </h2>
          {metrics.recentOrders.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">No orders yet.</p>
          ) : (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <Th>Order</Th>
                    <Th>Customer</Th>
                    <Th>Total</Th>
                    <Th>Status</Th>
                    <Th>Date</Th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono text-xs text-[var(--color-accent)] underline underline-offset-2 hover:no-underline"
                        >
                          #{order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[var(--color-text-primary)]">{order.customerName}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{order.customerEmail}</p>
                      </td>
                      <td className="py-3 px-4 font-medium text-[var(--color-text-primary)]">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border",
                            statusColors[order.status] || "bg-gray-50 text-gray-700 border-gray-200"
                          )}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-[var(--color-text-secondary)]">
                        {new Date(order.createdAt).toLocaleDateString("en-MY", {
                          timeZone: "Asia/Kuala_Lumpur",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-base font-bold tracking-tight text-[var(--color-text-primary)] mb-4">
            Low Stock Alerts
          </h2>
          {metrics.lowStockProducts.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">All stock levels OK.</p>
          ) : (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
              {metrics.lowStockProducts.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="text-sm text-[var(--color-text-primary)]">{p.name}</span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border",
                      p.stockQuantity <= 1
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    )}
                  >
                    {p.stockQuantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div
      className={cn(
        "bg-[var(--color-surface)] border border-[var(--color-border)] border-l-4 pl-5 pr-6 py-5",
        accent
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
        {label}
      </p>
      <p className="mt-1.5 text-3xl font-bold text-[var(--color-text-primary)]">
        {value}
      </p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
      {children}
    </th>
  );
}
