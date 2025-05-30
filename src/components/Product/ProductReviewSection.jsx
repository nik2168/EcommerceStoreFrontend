import React from "react";
import { BsStarFill } from "react-icons/bs";

const ProductReviewSection = ({ product }) => {
  // Compute total ratings and star breakdown

  const ratingData = product?.ratingData || [];
  const totalRatings = ratingData.length;
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalScore = 0;

  ratingData.forEach(({ rating }) => {
    totalScore += rating;
    const rounded = Math.round(rating);
    if (starCounts[rounded] !== undefined) {
      starCounts[rounded]++;
    }
  });

  const averageRating = totalRatings
    ? (totalScore / totalRatings).toFixed(1)
    : 0;

  // Sort reviews from latest (assuming most recent are last in array)
  const latestReviews = ratingData

  return (
    <div className="p-6 bg-base-200 max-w-6xl mx-auto rounded-2xl mt-6 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Ratings & Reviews</h2>

      <div className="flex items-center space-x-4">
        <div className="text-4xl font-bold">{averageRating} ★</div>
        <div className="text-gray-600 text-sm">
          {totalRatings.toLocaleString()} Ratings
        </div>
      </div>

      <div className="my-4">
        {Object.entries(starCounts)
          .reverse()
          .map(([star, count]) => (
            <div key={star} className="flex items-center text-sm mb-1">
              <span className="w-6">{star}★</span>
              <div className="flex-1 mx-2 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(count / totalRatings) * 100 || 0}%`,
                  }}
                ></div>
              </div>
              <span>{count.toLocaleString()}</span>
            </div>
          ))}
      </div>

      <div className="space-y-4 mt-6">
        {latestReviews?.map((review, i) => (
          <div key={i} className="p-4 border rounded-xl bg-base-100">
            <div className="flex items-center text-green-600 font-semibold">
              <div
                className={`flex items-center py-1 px-3 gap-1 rounded-md ${
                  review?.rating >= 3 ? "bg-green-600" : "bg-yellow-500"
                }`}
              >
                <p className="text-white text-[0.9rem] font-bold">
                  {review?.rating}
                </p>
                <BsStarFill className="text-white" size={11} />
              </div>
              <span className="ml-2 text-primary capitalize">
                {review?.userId?.username || "Anonymous"}
              </span>
            </div>
            {review?.message && (
              <p className="text-base-content my-2">{review.message}</p>
            )}

          
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviewSection;
