import { useEffect, useState } from "react";
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
    const positions = ["top", "bottom"];
    const sides = ["left", "right"];
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomPercent = () => `${Math.floor(Math.random() * 80) + 10}%`;

    return {
      [random(positions)]: randomPercent(),
      [random(sides)]: randomPercent(),
      size: 88 + Math.random() * 40,
      rotate: Math.random() * 30 - 15,
    };
  });

const FloatingIcon = ({ Icon, style, scrollY, index }) => {
  const depth = 0.15 + (index % 5) * 0.03;
  const time = Date.now() / 1000;
  const floatOffset = Math.sin(time + index) * 10;
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
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    const interval = setInterval(() => setScrollY(window.scrollY), 40);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const ratingHandler = async ({ rating, productId, orderId }) => {
    // console.log(rating, productId, orderId)
    // await rateProductOrder("Rating product...", { rating, productId, orderId });
    // refetch();
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
    // console.log(review, rating, productId, orderId)
    if (!review || !rating) {
      toast.error("Please enter review and rating");
      return;
    }
    await rateProductOrder("Review product...", {
      rating,
      review,
      productId,
      orderId,
    });
    setEditMode(false);
    refetch();
  };

  return (
    <div className="min-h-screen  relative overflow-hidden bg-base-100 py-3 px-0 md:px-4 lg:px-4 text-neutral-content">
      {floatingIcons.map((Icon, i) => (
        <FloatingIcon
          key={i}
          Icon={Icon}
          style={positions[i]}
          scrollY={scrollY}
          index={i}
        />
      ))}

      <div className="max-w-6xl w-full mx-auto mt-6 relative">
        <div className="w-full mx-auto p-0 md:p-4 lg:p-4 space-y-3">
          {data?.userOrders?.map((order) => (
            <div
              key={order._id}
              className="backdrop-blur-[50px] w-full rounded-xl shadow-md border border-base-300 p-6 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-base text-base-content">
                <div>
                  <span className="block text-sm font-medium text-base-content/70">
                    Order ID
                  </span>
                  <span className="text-md font-normal">{order._id}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-base-content/70">
                    Phone
                  </span>
                  <span className="text-lg">{order.phone}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-base-content/70">
                    Address
                  </span>
                  <span className="text-md font-light">{order.address}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-base-content/70">
                    Payment Method
                  </span>
                  <span className="text-lg capitalize">{order.paymentWay}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-base-content/70">
                    Status
                  </span>
                  <span
                    className={`badge badge-lg ${
                      order.status === "Delivered"
                        ? "badge-success"
                        : "badge-warning"
                    } mt-1`}
                  >
                    {order.status}
                  </span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-base-content/70">
                    Total Paid
                  </span>
                  <span className="text-lg font-semibold">
                    ${order.orderTotal}
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
                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-base-300 rounded-lg bg-base-200"
                      >
                        <div className="flex items-center w-full">
                          <img
                            src={product?.image?.url}
                            alt={product?.name}
                            className="w-[5rem] h-[6rem] md:w-[10rem] md:h-[13rem] lg:w-[12rem] lg:h-[13rem] object-cover rounded-lg border"
                          />
                          <div className="ml-6 flex flex-col justify-center items-start gap-1 md:gap-3 lg:gap-3">
                            <p className="font-bold text-sm md:text-xl lg:text-xl text-base-content capitalize">
                              {product?.title}
                            </p>
                            <p className="text-sm md:text-xl lg:text-xl  text-base-content font-extrabold">
                              <span className="text-[0.7rem] font-extralight">
                                a product by
                              </span>{" "}
                              {product?.company?.name}
                            </p>
                            <p className="text-sm text-base-content/70">
                              <span className="font-bold">Quantity: </span>{" "}
                              {item?.quantity}
                            </p>
                            <p className="text-sm text-base-content/70 font-bold">
                              Price: ${item?.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-1 w-full">
                          <div className="w-full flex flex-col  items-center justify-center gap-4 bg-base-100 p-2 rounded-xl shadow-md">
                            {item?.productRating === 0 || isEditMode ? (
                              <>
                                <div className="rating rating-md space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <input
                                      key={star}
                                      type="radio"
                                      name={`rating-${product?._id}-${order?._id}`}
                                      className={`mask mask-star-2 cursor-pointer ${
                                        star <=
                                        (ratingMap[product?._id + order?._id] ??
                                          item?.productRating)
                                          ? "bg-yellow-400"
                                          : "bg-gray-500"
                                      }`}
                                      onClick={() =>
                                        ratingHandler({
                                          rating: star,
                                          productId: product?._id,
                                          orderId: order?._id,
                                        })
                                      }
                                      aria-label={`${star} star`}
                                    />
                                  ))}
                                </div>
                                <textarea
                                  placeholder="Write your review..."
                                  defaultValue={item?.review}
                                  className="textarea textarea-bordered w-full resize-none min-h-[100px] text-base-content rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                  onChange={(e) =>
                                    handleReview({
                                      review: e.target.value,
                                      productId: product?._id,
                                      orderId: order?._id,
                                    })
                                  }
                                />
                              </>
                            ) : (
                              <>
                                {" "}
                                <Rating value={item?.productRating} size={24} />
                                <p className="text-sm p-2 text-base-content w-full min-h-12 bg-base-200">
                                  {item?.review}
                                </p>
                                {/* <textarea
                                  placeholder="Write your review..."
                                  defaultValue={item?.review}
                                  className="textarea textarea-bordered w-full resize-none min-h-[100px] text-base-content rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                  onChange={(e) =>
                                    handleReview({
                                      review: e.target.value,
                                      productId: product?._id,
                                      orderId: order?._id,
                                    })
                                  }
                                /> */}
                              </>
                            )}

                            <div className="gap-6 flex">
                             {isEditMode ? <button
                                className="btn btn-sm btn-primary self-end sm:self-auto"
                                type="button"
                                onClick={() =>
                                  handleReviewSubmit(product?._id, order?._id)
                                }
                              >
                                Submit
                              </button> 
                              :
                              <button
                                className="btn btn-sm btn-primary self-end sm:self-auto"
                                type="button"
                                onClick={() => setEditMode((pre) => !pre)}
                              >
                                Edit
                              </button>}
                            </div>
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
    </div>
  );
}
