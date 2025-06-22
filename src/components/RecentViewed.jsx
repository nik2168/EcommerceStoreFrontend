import React from "react";
import { Link } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";
import { formatPrice } from "../utils";
import Loading from "./Loading";
import SectionTitle from "./SectionTitle";
import { useSelector } from "react-redux";

const RecentViewed = ({
  title = "Recently Viewed",
  data,
  isLoading,
  isScrollable = true,
}) => {
  const { user } = useSelector((state) => state.userState);
  const products = data?.products?.slice(0, 12);

  if (isLoading) return <Loading />;
  if (!products?.length) return null;

  const containerClass = isScrollable
    ? "flex gap-2 md:gap-4 lg:gap-4 w-max pb-6"
    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4";

  return (
    <section className="my-3 backdrop-blur-lg">
      <SectionTitle text={title} />
      <div
        className={`backdrop-blur-lg rounded-3xl p-4 ${
          isScrollable ? "overflow-x-auto no-scrollbar" : ""
        }`}
      >
        <div className={containerClass}>
          {products.map(({ _id, title, price, image, rating, ratingData }) => (
            <Link
              key={_id}
              to={`/products/${_id}`}
              className="group border-2 border-base-300 p-1 rounded-lg bg-base-200 shadow-md w-[9rem] md:w-[12rem] lg:w-56 flex-shrink-0 hover:shadow-xl transition overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  loading="lazy"
                  src={image?.url}
                  alt={title}
                  className="w-full h-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="text-xs md:text-sm lg:text-sm font-medium truncate capitalize">
                  {title}
                </h3>
                <p className="text-primary text-xs md:text-sm lg:text-sm font-semibold">
                  {formatPrice(price)}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-semibold ${
                      rating >= 3 ? "bg-green-600" : "bg-yellow-500"
                    }`}
                  >
                    {rating.toFixed(1)}
                    <BsStarFill size={12} />
                  </span>
                  <span className="text-xs text-gray-500">
                    {ratingData?.length || 0} ratings
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentViewed;
