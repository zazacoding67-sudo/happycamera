"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

interface Order {
  id: string;
  orderNumber: string | null;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  source: string;
  createdAt: string;
  items: { quantity: number }[];
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.customerName.toLowerCase().includes(search.toLowerCase()) ||
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          (o.orderNumber ?? "").toLowerCase().includes(search.toLowerCase())
      ),
    [orders, search]
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Orders
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {orders.length} order(s) total
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56 border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors bg-[var(--color-surface)] rounded-none"
          />
          <Link
            href="/admin/orders/new-manual"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium tracking-wide transition-colors bg-yellow-400 text-black hover:bg-yellow-300"
          >
            <Plus size={15} />
            Log External Order
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {search ? `No orders matching "${search}".` : "No orders yet."}
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-[var(--color-surface)] border border-[var(--color-border)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Items</Th>
                  <Th>Total</Th>
                  <Th>Status</Th>
                  <Th>Source</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-xs text-yellow-600 underline underline-offset-2 hover:no-underline"
                      >
                        {order.orderNumber ?? `#${order.id.slice(0, 8)}`}
                      </Link>
                      <p className="text-[10px] text-[var(--color-text-secondary)] font-mono mt-0.5">
                        ID: {order.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[var(--color-text-primary)]">{order.customerName}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{order.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
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
                    <td className="py-3 px-4">
                      <span
                        className={`text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 border ${
                          order.source === "MANUAL"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        {order.source === "MANUAL" ? "Manual" : "Web"}
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

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block bg-[var(--color-surface)] border border-[var(--color-border)] p-4 hover:bg-[var(--color-bg)] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-xs text-yellow-600 underline underline-offset-2">
                      {order.orderNumber ?? `#${order.id.slice(0, 8)}`}
                    </span>
                    <p className="text-[10px] text-[var(--color-text-secondary)] font-mono mt-0.5">
                      ID: {order.id.slice(0, 8)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border",
                      statusColors[order.status] || "bg-gray-50 text-gray-700 border-gray-200"
                    )}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {order.customerName}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {order.customerEmail}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)] text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                  </span>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
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
