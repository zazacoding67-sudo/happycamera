"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/format";

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface TopProduct {
  name: string;
  quantitySold: number;
  revenue: number;
}

export default function RevenueChart({
  dailyRevenue,
  topProducts,
}: {
  dailyRevenue: DailyRevenue[];
  topProducts: TopProduct[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mt-8 sm:mt-10">
      <div className="lg:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] p-4 sm:p-6">
        <h2 className="text-base font-bold tracking-tight text-[var(--color-text-primary)] mb-1">
          Revenue (30 days)
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] mb-6">
          Daily sales from non-cancelled orders
        </p>
        <div className="h-[240px] sm:h-[280px]">
          {dailyRevenue.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-[var(--color-text-secondary)]">
              No revenue data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyRevenue}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--color-border)" }}
                  tickFormatter={(v: string) => {
                    const d = new Date(v);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `RM ${v.toLocaleString("en-MY")}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 0,
                    fontSize: 13,
                    boxShadow: "none",
                  }}
                  formatter={(value) => [`RM ${Number(value).toLocaleString("en-MY")}`, "Revenue"]}
                  labelFormatter={(label) => {
                    const d = new Date(String(label));
                    return d.toLocaleDateString("en-MY", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="p-4 sm:p-6 border-b border-[var(--color-border)]">
          <h2 className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
            Top Products
          </h2>
        </div>
        {topProducts.length === 0 ? (
          <div className="p-4 sm:p-6 text-sm text-[var(--color-text-secondary)]">
            No sales yet.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center justify-between px-4 sm:px-6 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-[var(--color-text-primary)] truncate">
                    {product.name}
                  </span>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs font-medium text-[var(--color-text-primary)]">
                    {product.quantitySold} sold
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    {formatPrice(product.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
