"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { statusColors, ORDER_STATUSES } from "@/lib/orderStatus";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  return `${year}-${month}`;
}

interface Order {
  id: string;
  orderNumber: string | null;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  source: string;
  paymentGateway: string;
  createdAt: string;
  items: { quantity: number }[];
}

const PAYMENT_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "CHIP", label: "Card (CHIP)" },
  { value: "MANUAL_BANK_TRANSFER", label: "Bank transfer" },
];

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "whitespace-nowrap px-3 py-1.5 text-[13px] font-medium tracking-wide transition-colors rounded-none border",
        active
          ? "bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300"
          : "border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-yellow-400 hover:text-yellow-600"
      )}
    >
      {children}
    </button>
  );
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [payment, setPayment] = useState("ALL");

  const pendingBt = status === "PENDING" && payment === "MANUAL_BANK_TRANSFER";

  const togglePendingBt = () => {
    if (pendingBt) {
      setStatus("ALL");
      setPayment("ALL");
    } else {
      setStatus("PENDING");
      setPayment("MANUAL_BANK_TRANSFER");
    }
  };

  const monthOptions = useMemo(() => {
    const keys = new Set<string>();
    keys.add(monthKey(new Date()));
    for (const o of orders) keys.add(monthKey(new Date(o.createdAt)));
    return [...keys]
      .sort()
      .reverse()
      .map((key) => {
        const [y, m] = key.split("-");
        return { key, label: `${MONTH_NAMES[Number(m) - 1]} ${y}` };
      });
  }, [orders]);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (status !== "ALL" && o.status !== status) return false;
        if (payment !== "ALL" && o.paymentGateway !== payment) return false;
        if (month !== "ALL" && monthKey(new Date(o.createdAt)) !== month) return false;
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          o.customerName.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          (o.orderNumber ?? "").toLowerCase().includes(q)
        );
      }),
    [orders, search, status, month, payment]
  );

  const hasActiveFilters = status !== "ALL" || month !== "ALL" || payment !== "ALL";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Orders
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {orders.length} order(s) total
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search by name or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56 border border-[var(--color-border)] px-3 py-2.5 text-base sm:text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors bg-[var(--color-surface)] rounded-none"
          />
          <select
            aria-label="Filter by month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full sm:w-44 border border-[var(--color-border)] px-3 py-2.5 text-base sm:text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors bg-[var(--color-surface)] rounded-none"
          >
            <option value="ALL">All time</option>
            {monthOptions.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
          <Link
            href="/admin/orders/new-manual"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium tracking-wide transition-colors bg-yellow-400 text-black hover:bg-yellow-300"
          >
            <Plus size={15} />
            Log External Order
          </Link>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mr-1">
            Status
          </span>
          <FilterPill active={status === "ALL"} onClick={() => setStatus("ALL")}>
            All
          </FilterPill>
          {ORDER_STATUSES.map((s) => (
            <FilterPill key={s} active={status === s} onClick={() => setStatus(s)}>
              {s[0] + s.slice(1).toLowerCase()}
            </FilterPill>
          ))}
          <span className="hidden sm:inline-block w-px h-5 bg-[var(--color-border)] mx-1" />
          <button
            type="button"
            aria-pressed={pendingBt}
            onClick={togglePendingBt}
            className={cn(
              "whitespace-nowrap px-3 py-1.5 text-[13px] font-medium tracking-wide transition-colors rounded-none",
              pendingBt
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-yellow-400 hover:text-yellow-600"
            )}
          >
            Pending Bank Transfers
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mr-1">
            Payment
          </span>
          {PAYMENT_OPTIONS.map((p) => (
            <FilterPill key={p.value} active={payment === p.value} onClick={() => setPayment(p.value)}>
              {p.label}
            </FilterPill>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {search.trim()
            ? `No orders matching "${search.trim()}".`
            : hasActiveFilters
              ? "No orders match the current filters."
              : "No orders yet."}
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
                      {new Date(order.createdAt).toLocaleString("en-MY", {
                        timeZone: "Asia/Kuala_Lumpur",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
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
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {new Date(order.createdAt).toLocaleString("en-MY", {
                    timeZone: "Asia/Kuala_Lumpur",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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