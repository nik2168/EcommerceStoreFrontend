import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { server } from "../../features/config";
import Loading from "../Loading";
import Lottie from "react-lottie-player";

import {
  FaRobot,
  FaRocket,
  FaBolt,
  FaEye,
  FaBullseye,
  FaCogs,
  FaShoppingCart,
  FaTag,
  FaBoxes,
  FaTruck,
  FaStar,
  FaMoneyBillAlt,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaIdBadge,
  FaCheckCircle,
} from "react-icons/fa";
import ConfirmationAnimation from "../../assets/confirmed.json";
import applepay from "../../assets/applepay.mp3";
import { useFetchUserCartQuery } from "../../features/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch } from "react-redux";
import { setCart } from "../../features/cart/cartSlice";

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const address = searchParams.get("address");
  const name = searchParams.get("name");
  const phone = searchParams.get("phone");
  const cartItemsObj = JSON.parse(searchParams.get("cartItems") || "[]");

  const cartItems = cartItemsObj?.map((item) => ({
    productId: item?.productId,
    quantity: item?.quantity,
    price: item?.price,
  }));

  const [order, setOrder] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [positions] = useState(generatePositions());
  const [showSuccess, setShowSuccess] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    const interval = setInterval(() => setScrollY(window.scrollY), 40);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      const sound = new Audio(applepay);
      sound.play().catch((err) => console.error("Audio playback failed", err));
      window.removeEventListener("click", handleInteraction);
    };

    if (showSuccess) {
      window.addEventListener("click", handleInteraction);
    }

    return () => window.removeEventListener("click", handleInteraction);
  }, [showSuccess]);

  const dispatch = useDispatch();

  const { isLoading, data, isError, error, refetch } = useFetchUserCartQuery(
    {}
  );

  useErrors([{ isError, error }]);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await axios.post(
          `${server}/api/v1/order/payment/verify`,
          { sessionId, address, name, cartItems, phone },
          {
            withCredentials: true,
            authorization: `Bearer ${localStorage.getItem("nox_token")}`,
          }
        );
        setOrder(data?.order);
        refetch();
        if (!isLoading) dispatch(setCart(data?.cart));
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Payment verification failed:", error);
      }
    };
    if (sessionId) verifyPayment();
  }, [sessionId]);

  if (!order) return <Loading />;

  return (
    <div className="min-h-screen relative overflow-hidden bg-base-100 py-10 px-4 text-neutral-content">
      {floatingIcons.map((Icon, i) => (
        <FloatingIcon
          key={i}
          Icon={Icon}
          style={positions[i]}
          scrollY={scrollY}
          index={i}
        />
      ))}

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center animate-bounce-in flex flex-col justify-center items-center">
            {/* <FaCheckCircle className="text-success text-6xl mb-4 animate-pulse" /> */}
            <Lottie
              loop
              animationData={ConfirmationAnimation}
              play
              style={{ width: 300, height: 300 }}
            />{" "}
            <h1 className="text-3xl font-bold text-green-400">
              Payment Successful!
            </h1>
            <p className="text-sm mt-2">Redirecting to your order summary...</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-6 space-y-6 z-10 relative">
        <div className="text-center mb-10 flex flex-col justify-center items-center">
          <FaCheckCircle className="text-teal-300 size-[5rem]" />
          <h1 className="text-5xl font-bold text-teal-300 mt-6">
            Ordered Successfully ! 🎉
          </h1>
          <p className="text-md font-extralight mt-3 text-conent">
            Thank you for your purchase, {order?.name}!
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-4">
          <div className="backdrop-blur-[50px] rounded-xl shadow-md border border-base-300 p-6 space-y-6">
            {/* Heading */}
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Order Summary
              </h2>
              <p className="text-base-content/70 text-sm">
                Thank you for your purchase! Here are your order details:
              </p>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-base text-base-content justify-center items-center">
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
                      ? "badge-success "
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

            {/* Products */}
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
                      className="flex gap-4 p-3 border border-base-300 rounded-lg bg-base-200"
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
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                className="p-3 px-5 rounded-full  bg-primary hover:bg-opacity-80 my-6 text-white"
                onClick={() => navigate("/orders")}
              >
                View All Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
