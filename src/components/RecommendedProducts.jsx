import { Link } from "react-router-dom";
import { formatPrice } from "../utils";
import { BsStarFill } from "react-icons/bs";
import SectionTitle from "./SectionTitle";
import { useRecommendedProductsQuery } from "../features/api";
import { useErrors } from "../hooks/hook";

const RecommendedProducts = () => {
  const { data, error, isError } = useRecommendedProductsQuery();
  useErrors([{ isError, error }]);

  return (
    <section className="my-3 backdrop-blur-lg">
      <SectionTitle text="Recommended Products" />
      <div className="mt-3  backdrop-blur-lg rounded-3xl p-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 md:gap-4 lg:gap-4 w-max pb-6">
          {data?.products?.map((product) => {
            const { _id, title, price, image, rating, ratingData } = product;
            const dollarsAmount = formatPrice(price);

            return (
              <Link
                key={_id}
                to={`/products/${_id}`}
                className="group border-2 border-base-300 p-1 rounded-lg bg-base-200 shadow-md  w-[9rem] md:w-[12rem] lg:w-56 flex-shrink-0 hover:shadow-xl transition overflow-hidden"
              >
                <div className="aspect-[4/3] md:p-1 lg:p-1 overflow-hidden">
                  <img
                    src={image.url}
                    alt={title}
                    className="w-full h-full rounded-lg md:w-full md:h-full lg:w-full lg:h-full object-cover transition-transform duration-300 group-hover:shadow-xl"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="text-xs md:text-sm lg:text-sm font-medium truncate">
                    {title}
                  </h3>
                  <p className="text-primary text-xs md:text-sm lg:text-sm  font-semibold">
                    {dollarsAmount}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-semibold ${
                        rating >= 3 ? "bg-green-600" : "bg-yellow-500"
                      }`}
                    >
                      {rating}
                      <BsStarFill size={12} />
                    </span>
                    <span className="text-xs text-gray-500">
                      {ratingData?.length} ratings
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;
