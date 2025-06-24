import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  useRateProductOrderMutation,
  useLazyGetUserOrdersQuery,
} from "../features/api";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import Rating from "./Rating";
import toast from "react-hot-toast";

const LIMIT = 6;

export default function PaymentSuccess() {
  const [reviewMap, setReviewMap] = useState({});
  const [ratingMap, setRatingMap] = useState({});
  const [isEditMode, setEditMode] = useState(false);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);

  const [fetchOrders, { data, isLoading, isError, error }] =
    useLazyGetUserOrdersQuery();
  const [rateProductOrder] = useAsyncMutation(useRateProductOrderMutation);
  useErrors([{ isError, error }]);

  useEffect(() => {
    fetchOrders({ page, limit: LIMIT });
  }, [page]);

  useEffect(() => {
    if (data?.userOrders) {
      if (data.userOrders.length < LIMIT) setHasMore(false);
      setOrders((prev) => [...prev, ...data.userOrders]);
    }
  }, [data]);

  const lastOrderRef = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const ratingHandler = ({ rating, productId, orderId }) => {
    setRatingMap((prev) => ({
      ...prev,
      [productId + orderId]: rating,
    }));
  };

  const handleReview = ({ review, productId, orderId }) => {
    setReviewMap((prev) => ({
      ...prev,
      [productId + orderId]: review,
    }));
  };

  const handleReviewSubmit = async (productId, orderId) => {
    const review = reviewMap[productId + orderId];
    const rating = ratingMap[productId + orderId];
    if (!review || !rating)
      return toast.error("Please enter review and rating");

    await rateProductOrder("Review product...", {
      rating,
      review,
      productId,
      orderId,
    });

    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-base-100 py-3 px-4 text-neutral-content">
      <div className="max-w-6xl mx-auto mt-6 space-y-6">
        {orders.map((order, index) => {
          const isLast = index === orders.length - 1;

          return (
            <div
              key={order._id}
              ref={isLast ? lastOrderRef : null}
              className="rounded-xl shadow-md border border-base-300 p-6 space-y-6 bg-base-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-base-content">
                <Info label="Order ID" value={order._id} />
                <Info label="Phone" value={order.phone} />
                <Info label="Address" value={order.address} />
                <Info
                  label="Payment Method"
                  value={order.paymentWay}
                  capitalize
                />
                <Info label="Total Paid" value={`$${order.orderTotal}`} bold />
                <div>
                  <span className="block text-sm font-medium text-base-content/70">
                    Status
                  </span>
                  <span
                    className={`badge badge-lg mt-1 ${
                      order.status === "Delivered"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-base-content mb-3">
                  Items in this Order
                </h3>
                <div className="space-y-3">
                  {order?.products?.map((item, idx) => {
                    const product = item.productId;
                    const key = product?._id + order._id;
                    const isEditable = isEditMode || item?.productRating === 0;

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-base-300 rounded-lg bg-base-100"
                      >
                        <div className="flex items-center">
                          <img
                            loading="lazy"
                            src={product?.image?.url}
                            alt={product?.title}
                            className="w-[5rem] h-[6rem] md:w-[10rem] md:h-[13rem] lg:w-[12rem] lg:h-[13rem] object-cover rounded-lg border"
                          />
                          <div className="ml-6 flex flex-col gap-2">
                            <p className="font-bold text-base-content capitalize">
                              {product?.title}
                            </p>
                            <p className="text-sm text-base-content">
                              <span className="text-xs">a product by</span>{" "}
                              {product?.company?.name}
                            </p>
                            <p className="text-sm text-base-content/70">
                              <b>Quantity:</b> {item?.quantity}
                            </p>
                            <p className="text-sm text-base-content/70 font-bold">
                              Price: ${item?.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4 p-2 rounded-xl shadow bg-base-200">
                          {isEditable ? (
                            <>
                              <div className="rating rating-md space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <input
                                    key={star}
                                    type="radio"
                                    name={`rating-${key}`}
                                    className={`mask mask-star-2 cursor-pointer ${
                                      star <=
                                      (ratingMap[key] ?? item?.productRating)
                                        ? "bg-yellow-400"
                                        : "bg-gray-500"
                                    }`}
                                    onClick={() =>
                                      ratingHandler({
                                        rating: star,
                                        productId: product._id,
                                        orderId: order._id,
                                      })
                                    }
                                    aria-label={`${star} star`}
                                  />
                                ))}
                              </div>
                              <textarea
                                placeholder="Write your review..."
                                defaultValue={item?.review}
                                className="textarea textarea-bordered w-full min-h-[100px] resize-none rounded-xl"
                                onChange={(e) =>
                                  handleReview({
                                    review: e.target.value,
                                    productId: product._id,
                                    orderId: order._id,
                                  })
                                }
                              />
                            </>
                          ) : (
                            <>
                              <Rating value={item?.productRating} size={24} />
                              <p className="text-sm p-2 bg-base-100 min-h-12">
                                {item?.review}
                              </p>
                            </>
                          )}

                          <div className="flex gap-4">
                            {isEditable || !item?.review ? (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() =>
                                  handleReviewSubmit(product._id, order._id)
                                }
                              >
                                Submit
                              </button>
                            ) : (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setEditMode((prev) => !prev)}
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && <p className="text-center py-4">Loading...</p>}
        {!hasMore && (
          <p className="text-center py-4 text-sm">No more orders.</p>
        )}
      </div>
    </div>
  );
}

const Info = ({ label, value, capitalize = false, bold = false }) => (
  <div>
    <span className="block text-sm font-medium text-base-content/70">
      {label}
    </span>
    <span
      className={`text-md ${bold ? "font-semibold" : "font-normal"} ${
        capitalize ? "capitalize" : ""
      }`}
    >
      {value}
    </span>
  </div>
);
