import { BsStarFill } from "react-icons/bs";
import {
  BiDislike,
  BiLike,
  BiSolidCommentDetail,
  BiSolidDislike,
  BiSolidLike,
} from "react-icons/bi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useSocket from "../../utils/socket";
import { useSocketEvents } from "../../hooks/hook";
import {
  REVIEW_DISLIKES,
  REVIEW_LIKES,
  REVIEW_REPLY,
} from "../../utils/events";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductReviewSection = ({ product, refetch }) => {
  const [productData, setProductData] = useState(product);
  const [activeReplies, setActiveReplies] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingToReviewId, setReplyingToReviewId] = useState(null);

  const socket = useSocket();
  const { user } = useSelector((state) => state.userState);
  const navigate = useNavigate();

  useEffect(() => {
    setProductData(product);
  }, [product]);

  const isUserLoggedIn = () => {
    if (!user) {
      toast.error("Please login to continue.");
      navigate("/login");
      return false;
    }
    return true;
  };

  const emitSocketEvent = (event, payload) => {
    socket?.current?.emit(event, payload);
  };

  const likeReviewHandler = (reviewId) => {
    if (!isUserLoggedIn()) return;
    emitSocketEvent(REVIEW_LIKES, {
      productId: productData._id,
      reviewId,
      userId: user._id,
    });
  };

  const dislikeReviewHandler = (reviewId) => {
    if (!isUserLoggedIn()) return;
    emitSocketEvent(REVIEW_DISLIKES, {
      productId: productData._id,
      reviewId,
      userId: user._id,
    });
  };

  const submitReplyHandler = () => {
    if (!isUserLoggedIn()) return;
    if (!replyText.trim()) return alert("Reply cannot be empty");

    emitSocketEvent(REVIEW_REPLY, {
      productId: productData._id,
      reviewId: replyingToReviewId,
      userId: user._id,
      text: replyText.trim(),
    });

    setReplyText("");
    setIsReplyModalOpen(false);
  };

  const reviewLikesHandler = useCallback(
    ({ productId, newData, reviewId, userId }) => {
      setProductData((prev) => {
        const cloned = structuredClone(prev); // or use deep clone below
        const review = cloned.ratingData.find(
          (r) => r._id.toString() === reviewId
        );
        review.likes = newData;
        return cloned;
      });
    },
    []
  );

  const reviewDislikesHandler = useCallback(
    ({ productId, newData, reviewId, userId }) => {
      setProductData((prev) => {
        const cloned = structuredClone(prev); // or use deep clone below
        const review = cloned.ratingData.find(
          (r) => r._id.toString() === reviewId
        );
        review.dislikes = newData;
        return cloned;
      });
    },
    []
  );

  const reviewReplyHandler = useCallback(({ reviewId, newData, productId }) => {
    // console.log(newData)
    setProductData((prev) => {
      const cloned = structuredClone(prev); // or use deep clone below
      const review = cloned.ratingData.find(
        (r) => r._id.toString() === reviewId
      );
      review.replies = newData;
      return cloned;
    });
  }, []);

  useSocketEvents(socket?.current, {
    [REVIEW_LIKES]: reviewLikesHandler,
    [REVIEW_DISLIKES]: reviewDislikesHandler,
    [REVIEW_REPLY]: reviewReplyHandler,
  });

  const ratingData = productData?.ratingData || [];
  const starStats = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let score = 0;

    ratingData.forEach(({ rating }) => {
      const rounded = Math.round(rating);
      if (counts[rounded] !== undefined) counts[rounded]++;
      score += rating;
    });

    return {
      counts,
      average: ratingData.length ? (score / ratingData.length).toFixed(1) : 0,
    };
  }, [ratingData]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="p-6 backdrop-blur-[50px] max-w-6xl mx-auto rounded-2xl mt-3 shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Ratings & Reviews</h2>

      <div className="flex items-center space-x-4">
        <div className="text-4xl font-bold">{starStats.average} ★</div>
        <div className="text-gray-600 text-sm">
          {ratingData.length.toLocaleString()} Ratings
        </div>
      </div>

      <div className="my-4">
        {Object.entries(starStats.counts)
          .reverse()
          .map(([star, count]) => (
            <div key={star} className="flex items-center text-sm mb-1">
              <span className="w-6">{star}★</span>
              <div className="flex-1 mx-2 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(count / ratingData.length) * 100 || 0}%`,
                  }}
                ></div>
              </div>
              <span>{count.toLocaleString()}</span>
            </div>
          ))}
      </div>

      <div className="space-y-4 mt-6">
        {ratingData.slice(0, 6).map((review, i) => {
          const isLiked = review?.likes?.includes(user?._id);
          const isDisliked = review?.dislikes?.includes(user?._id);

          return (
            <div
              key={review._id || i}
              className="p-4 border border-base-300 rounded-lg bg-base-200"
            >
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
                <span className="ml-3 text-xs text-gray-500">
                  {formatDate(review?.timestamp)}
                </span>
              </div>

              {review?.message && (
                <p className="text-base-content my-2">{review.message}</p>
              )}

              <div className="flex items-center gap-3 mt-1 text-sm">
                <button
                  className="flex items-center gap-1"
                  onClick={() => likeReviewHandler(review._id)}
                >
                  {isLiked ? (
                    <BiSolidLike className="text-green-600" />
                  ) : (
                    <BiLike />
                  )}
                  {review?.likes?.length || 0}
                </button>

                <button
                  className="flex items-center gap-1"
                  onClick={() => dislikeReviewHandler(review._id)}
                >
                  {isDisliked ? (
                    <BiSolidDislike className="text-red-600" />
                  ) : (
                    <BiDislike />
                  )}
                  {review?.dislikes?.length || 0}
                </button>

                <button
                  onClick={() =>
                    setActiveReplies(
                      activeReplies === review._id ? null : review._id
                    )
                  }
                  className="flex items-center gap-1 ml-6 text-xs "
                >
                  <BiSolidCommentDetail className="text-primary text-lg hover:opacity-70" />
                  {review?.replies?.length || 0}
                </button>
              </div>

              {activeReplies === review._id && (
                <div className="mt-3 ml-6 p-3 border-l border-primary space-y-2 bg-base-100 rounded">
                  {review?.replies?.length > 0 ? (
                    review.replies.map((reply, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold text-primary">
                          {reply?.userId?.username || "User"}:
                        </span>{" "}
                        <span>{reply?.message}</span>
                        <div className="text-xs text-gray-500">
                          {formatDate(reply.timestamp)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No replies yet.</p>
                  )}

                  <button
                    className="mt-2 text-sm text-blue-600 underline"
                    onClick={() => {
                      setReplyingToReviewId(review._id);
                      setIsReplyModalOpen(true);
                    }}
                  >
                    Add Reply
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isReplyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-200 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Write a Reply</h3>
            <textarea
              rows="4"
              className="w-full p-2 border rounded mb-4"
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:opacity-70"
                onClick={() => {
                  setIsReplyModalOpen(false);
                  setReplyText("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:opacity-70"
                onClick={submitReplyHandler}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewSection;
