import { useEffect, useState, useMemo } from "react";
import {
  FaBolt,
  FaBullseye,
  FaCheckCircle,
  FaCogs,
  FaEye,
  FaRobot,
  FaRocket,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetUserOrdersQuery,
  useRateProductOrderMutation,
} from "../features/api";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import Rating from "./Rating";
import toast from "react-hot-toast";

const floatingIcons = [
  FaShoppingCart,
  FaRobot,
  FaRocket,
  FaBolt,
  FaEye,
  FaBullseye,
  FaCogs,
];

const generatePositions = () =>
  floatingIcons.map(() => {
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomPercent = () => `${Math.floor(Math.random() * 80) + 10}%`;
    return {
      [random(["top", "bottom"])]: randomPercent(),
      [random(["left", "right"])]: randomPercent(),
      size: 88 + Math.random() * 40,
      rotate: Math.random() * 30 - 15,
    };
  });

const FloatingIcon = ({ Icon, style, scrollY, index }) => {
  const depth = 0.15 + (index % 5) * 0.03;
  const floatOffset = Math.sin(Date.now() / 1000 + index) * 10;
  const translateY = scrollY * depth + floatOffset;

  return (
    <Icon
      style={{
        position: "absolute",
        color: "#00FFD1",
        opacity: 0.8,
        filter: "blur(6px)",
        transform: `translateY(${translateY}px) rotate(${style.rotate}deg)`,
        transition: "transform 0.1s linear",
        ...style,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}
      size={style.size}
    />
  );
};

export default function PaymentSuccess() {
  const [scrollY, setScrollY] = useState(0);
  const [positions] = useState(generatePositions());
  const [reviewMap, setReviewMap] = useState({});
  const [ratingMap, setRatingMap] = useState({});
  const [isEditMode, setEditMode] = useState(false);

  const { data, isLoading, isError, error, refetch } = useGetUserOrdersQuery();
  const [rateProductOrder] = useAsyncMutation(useRateProductOrderMutation);
  useErrors([{ isError, error }]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    const interval = setInterval(onScroll, 40);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(interval);
    };
  }, []);

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
    refetch();
  };

  const orders = useMemo(() => data?.userOrders || [], [data]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-base-100 py-3 px-4 text-neutral-content">
      {floatingIcons.map((Icon, i) => (
        <FloatingIcon
          key={i}
          Icon={Icon}
          style={positions[i]}
          scrollY={scrollY}
          index={i}
        />
      ))}

      <div className="max-w-6xl mx-auto mt-6 relative space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="backdrop-blur-[50px] rounded-xl shadow-md border border-base-300 p-6 space-y-6"
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
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-base-300 rounded-lg bg-base-200"
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

                      <div className="flex flex-col justify-center gap-4 p-2 rounded-xl shadow bg-base-100">
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
                            <p className="text-sm p-2 bg-base-200 min-h-12">
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
        ))}
      </div>
    </div>
  );
}

// Small reusable UI component for order info
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
