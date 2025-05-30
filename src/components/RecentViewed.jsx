import React from "react";
import { Link } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";

import { useFetchRecentSearchQuery } from "../features/api";
import { useErrors } from "../hooks/hook";
import { formatPrice } from "../utils";
import Loading from "./Loading";
import SectionTitle from "./SectionTitle";

const RecentViewed = ({title = "Recently Viewed", data, isLoading}) => {
  console.log(data)

  if (isLoading) return <Loading />;

  const products = data?.products?.slice(0, 6);

  if (!products?.length) return null;

  return (
    <section className="p-3 pb-6">
      <SectionTitle text={title}/>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-12 px-2 sm:px-4 lg:px-0">
        {products.map((product) => {
          const { _id, title, price, image, rating, ratingData = [] } = product;
          const dollarsAmount = formatPrice(price);
          const ratingColor = rating >= 3 ? "bg-green-600" : "bg-yellow-500";

          return (
            <Link
              key={_id}
              to={`/products/${_id}`}
              className="group card bg-base-200 hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden"
            >
              <figure className="overflow-hidden">
                <img
                  src={image.url}
                  alt={title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </figure>

              <div className="p-4">
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className={`flex items-center px-2 py-0.5 text-white text-xs font-medium rounded-md ${ratingColor}`}
                  >
                    {rating}
                    <BsStarFill className="ml-1" size={12} />
                  </div>
                  <p className="text-xs text-blue-400">
                    {ratingData.length} ratings
                  </p>
                </div>

                {/* Title & Price */}
                <h3 className="text-sm font-semibold text-base-content capitalize leading-snug line-clamp-2 mb-1">
                  {title}
                </h3>
                <p className="text-sm font-medium text-primary">
                  {dollarsAmount}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RecentViewed;
