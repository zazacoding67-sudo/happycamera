"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  product: { name: string };
}

export default function ReviewModeration({
  reviews,
}: {
  reviews: Review[];
}) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const toggleApproval = async (id: string, approved: boolean) => {
    setActionLoading(id);
    await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    setActionLoading(null);
    router.refresh();
  };

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-bg)] flex items-center justify-center mb-4">
          <MessageSquare size={22} className="text-[var(--color-text-secondary)]" />
        </div>
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          No reviews yet
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] max-w-sm">
          When customers submit reviews, they&rsquo;ll appear here for moderation.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-[var(--color-surface)] border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <Th>Product</Th>
              <Th>Customer</Th>
              <Th>Rating</Th>
              <Th>Comment</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors"
              >
                <td className="py-3 px-4 text-[var(--color-text-primary)]">
                  {review.product.name}
                </td>
                <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                  {review.customerName}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        className={
                          star <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-[var(--color-border)]"
                        }
                      />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-[var(--color-text-secondary)] max-w-xs">
                  <p className="line-clamp-2 text-xs leading-relaxed">{review.comment}</p>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border",
                      review.approved
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    )}
                  >
                    {review.approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {!review.approved && (
                      <button
                        onClick={() => toggleApproval(review.id, true)}
                        disabled={actionLoading === review.id}
                        className="p-2 text-green-600 hover:bg-green-50 transition-colors rounded-sm disabled:opacity-50"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {review.approved && (
                      <button
                        onClick={() => toggleApproval(review.id, false)}
                        disabled={actionLoading === review.id}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 transition-colors rounded-sm disabled:opacity-50"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {review.product.name}
              </p>
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border shrink-0",
                  review.approved
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                )}
              >
                {review.approved ? "Approved" : "Pending"}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">
              {review.customerName}
            </p>
            <div className="flex items-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={13}
                  className={
                    star <= review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-[var(--color-border)]"
                  }
                />
              ))}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
              {review.comment}
            </p>
            <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)]">
              {!review.approved && (
                <button
                  onClick={() => toggleApproval(review.id, true)}
                  disabled={actionLoading === review.id}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-green-200 text-green-600 hover:bg-green-50 transition-colors rounded-none disabled:opacity-50"
                >
                  <Check size={14} />
                  Approve
                </button>
              )}
              {review.approved && (
                <button
                  onClick={() => toggleApproval(review.id, false)}
                  disabled={actionLoading === review.id}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-yellow-200 text-yellow-600 hover:bg-yellow-50 transition-colors rounded-none disabled:opacity-50"
                >
                  <X size={14} />
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
      {children}
    </th>
  );
}
