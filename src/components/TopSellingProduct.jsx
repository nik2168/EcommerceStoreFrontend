import React from "react";
import { useTopSellingProductsUserQuery } from "../features/api";
import Loading from "./Loading";
import { useErrors } from "../hooks/hook";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TopSellingProduct = () => {
  const navigate = useNavigate();

  const { data, isError, error, isLoading } = useTopSellingProductsUserQuery();
  useErrors([{ isError, error }]);

  if (isLoading) return <Loading />;

  const products = data?.sortedProductsData || [];

  return (
    <section className="px-4 py-8 md:px-8 lg:px-12 xl:px-16 backdrop-blur-lg ">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 text-base-content tracking-tight">
        Top Selling Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 8).map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/products/${product._id}`)}
            className="cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-200 backdrop-blur-[50px] "
          >
            <div className="w-full aspect-[4/3] overflow-hidden">
              <img
                src={product.image.url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 space-y-1">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-base-content capitalize line-clamp-2">
                {product.title}
              </h3>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-base-content/60 font-semibold capitalize">
                  {product.company?.name}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    product.rating <= 3 ? "text-yellow-500" : "text-green-500"
                  }`}
                >
                  <FaStar className="text-sm" />
                  {product.rating.toFixed(1)}
                </span>
              </div>

              <div className="text-sm sm:text-base lg:text-lg font-bold text-primary pt-1">
                ${product.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopSellingProduct;
