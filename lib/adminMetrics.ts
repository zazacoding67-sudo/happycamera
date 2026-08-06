import { prisma } from "@/lib/prisma";

export interface AdminRecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
}

export interface AdminMetrics {
  productCount: number;
  orderCount: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: AdminRecentOrder[];
  lowStockProducts: { name: string; stockQuantity: number }[];
  dailyRevenue: { date: string; revenue: number }[];
  topProducts: { name: string; quantitySold: number; revenue: number }[];
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const [productCount, orderCount, recentOrders, lowStockProducts] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      where: { stockQuantity: { lte: 2 } },
      select: { name: true, stockQuantity: true },
      orderBy: { stockQuantity: "asc" },
    }),
  ]);

  const revenueAgg = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: { not: "CANCELLED" } },
  });
  const totalRevenue = revenueAgg._sum.totalAmount ?? 0;

  const pendingOrders = await prisma.order.count({
    where: { status: "PENDING" },
  });

  // Daily revenue for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recent30d = await prisma.order.findMany({
    where: {
      status: { not: "CANCELLED" },
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { createdAt: true, totalAmount: true },
    orderBy: { createdAt: "asc" },
  });

  const dailyMap: Record<string, number> = {};
  const today = new Date();
  for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = 0;
  }
  for (const o of recent30d) {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (dailyMap[key] !== undefined) {
      dailyMap[key] += o.totalAmount;
    }
  }
  const dailyRevenue = Object.entries(dailyMap).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  // Top products by quantity sold
  const orderItemGroups = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { productId: { not: null } },
    _sum: { quantity: true, price: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const productIds = orderItemGroups
    .map((g) => g.productId)
    .filter((id): id is string => id !== null);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p.name]));

  const topProducts = orderItemGroups
    .filter((g) => g._sum.quantity && g._sum.price)
    .map((g) => ({
      name: productMap.get(g.productId ?? "") ?? "Unknown",
      quantitySold: g._sum.quantity ?? 0,
      revenue: (g._sum.quantity ?? 0) * (g._sum.price ?? 0),
    }));

  return {
    productCount,
    orderCount,
    totalRevenue,
    pendingOrders,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      totalAmount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt,
    })),
    lowStockProducts,
    dailyRevenue,
    topProducts,
  };
}
