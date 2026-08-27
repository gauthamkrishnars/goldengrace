"use client";

import { useState } from "react";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  helpful: number;
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: "r1",
    author: "Priya M.",
    rating: 5,
    date: "2026-08-15",
    title: "Absolutely stunning!",
    body: "The craftsmanship is exceptional. The diamond sparkles beautifully in every light. My fiancée loved it! Golden Grace delivered on time and the packaging was premium.",
    helpful: 24,
    verified: true,
  },
  {
    id: "r2",
    author: "Rahul K.",
    rating: 4,
    date: "2026-08-10",
    title: "Great quality, slightly smaller than expected",
    body: "Beautiful piece of jewellery. The gold weight feels substantial and the stone quality is top-notch. Took one star off because it looked slightly smaller in person than in the photos.",
    helpful: 18,
    verified: true,
  },
  {
    id: "r3",
    author: "Ananya S.",
    rating: 5,
    date: "2026-08-05",
    title: "Perfect anniversary gift",
    body: "Bought this for our 25th anniversary. The attention to detail is remarkable. The lifetime exchange policy gives great peace of mind. Highly recommend!",
    helpful: 31,
    verified: true,
  },
  {
    id: "r4",
    author: "Vikram D.",
    rating: 4,
    date: "2026-07-28",
    title: "Excellent value for money",
    body: "Compared prices across multiple platforms and Golden Grace offered the best value. The product matches the description perfectly. Delivery was quick.",
    helpful: 12,
    verified: false,
  },
];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

function RatingDistribution({ reviews }: { reviews: Review[] }) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
      {/* Average */}
      <div className="text-center">
        <p className="text-4xl font-bold text-gray-800">{avgRating.toFixed(1)}</p>
        <StarRating rating={avgRating} size="md" />
        <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
      </div>

      {/* Distribution */}
      <div className="flex-1 space-y-1 w-full max-w-xs">
        {distribution.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-3 text-gray-500">{star}</span>
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
              />
            </div>
            <span className="w-6 text-right text-gray-400">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [sortBy, setSortBy] = useState<"newest" | "helpful" | "highest">("newest");
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", body: "" });
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "helpful") return b.helpful - a.helpful;
    if (sortBy === "highest") return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.title.trim() || !newReview.body.trim()) return;

    const review: Review = {
      id: `r-${Date.now()}`,
      author: "You",
      rating: newReview.rating,
      date: new Date().toISOString().split("T")[0],
      title: newReview.title,
      body: newReview.body,
      helpful: 0,
      verified: true,
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, title: "", body: "" });
    setShowForm(false);
  };

  const toggleHelpful = (reviewId: string) => {
    if (helpfulClicked.has(reviewId)) return;
    setHelpfulClicked((prev) => new Set(prev).add(reviewId));
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
    );
  };

  return (
    <div className="border-t border-gray-100 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-bold text-gray-800">Customer Reviews</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand/90 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Write a Review
        </button>
      </div>

      {/* Rating Distribution */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <RatingDistribution reviews={reviews} />
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-xl p-5 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="p-0.5"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= newReview.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              placeholder="Summarize your experience"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea
              value={newReview.body}
              onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
              placeholder="Tell others about your experience with this product..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 bg-white resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Sort */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-xs text-gray-400">Sort by:</span>
        {(["newest", "helpful", "highest"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`text-xs font-medium capitalize transition-colors ${
              sortBy === option ? "text-brand" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {option === "highest" ? "Highest Rated" : option === "helpful" ? "Most Helpful" : "Newest"}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  <span className="text-sm font-semibold text-gray-800">{review.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{review.author}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-400">{review.date}</span>
                  {review.verified && (
                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-medium">
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{review.body}</p>
            <button
              onClick={() => toggleHelpful(review.id)}
              disabled={helpfulClicked.has(review.id)}
              className={`flex items-center gap-1.5 mt-3 text-xs transition-colors ${
                helpfulClicked.has(review.id)
                  ? "text-brand font-medium"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
