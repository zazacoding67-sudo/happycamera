import { prisma } from "@/lib/prisma";
import ReviewModeration from "./ReviewModeration";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const serialized = reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Manage Reviews
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {reviews.filter((r) => !r.approved).length} pending moderation
        </p>
      </div>

      <ReviewModeration reviews={serialized} />
    </div>
  );
}
