"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Props {
  productId: string;
  reviews: Review[];
}

export default function ReviewSection({ productId, reviews }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerName || !comment) {
      setError("Please fill in all fields.");
      return;
    }

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, customerName, rating, comment }),
    });

    if (!res.ok) {
      setError("Failed to submit review. Please try again.");
      return;
    }

    setSubmitted(true);
    setCustomerName("");
    setRating(5);
    setComment("");
  };

  return (
    <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
      <h2 className="text-sm uppercase tracking-[0.15em] font-semibold text-[var(--color-text-primary)]">
        Customer Reviews
      </h2>

      {reviews.length > 0 && (
        <div className="flex items-center gap-2 mt-3 mb-6">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                fill={s <= Math.round(avgRating) ? "#1A1A1A" : "none"}
                stroke={s <= Math.round(avgRating) ? "#1A1A1A" : "#ccc"}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)]">
            ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </span>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {reviews.length === 0 && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            No reviews yet. Be the first to review this product.
          </p>
        )}
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-[var(--color-border)] p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {review.customerName}
              </p>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    fill={s <= review.rating ? "#1A1A1A" : "none"}
                    stroke={s <= review.rating ? "#1A1A1A" : "#ccc"}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {submitted ? (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3">
          Thanks! Your review has been submitted and will appear after moderation.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Write a Review
          </h3>
          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-0 focus:border-black transition-colors"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-secondary)]">
              Rating:
            </span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="p-0.5"
              >
                <Star
                  size={16}
                  fill={s <= rating ? "#1A1A1A" : "none"}
                  stroke={s <= rating ? "#1A1A1A" : "#ccc"}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your thoughts..."
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-0 focus:border-black transition-colors resize-none"
          />
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#1A1A1A] text-white text-sm font-medium py-3 tracking-wide hover:bg-[#333] transition-colors"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
}
