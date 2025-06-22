import { Link } from "react-router-dom";
import { formatPrice } from "../utils";
import { BsStarFill } from "react-icons/bs";

const ProductsList = ({ data: products }) => {
  return (
    <div className="mt-8 grid gap-4">
      {products.map((product) => {
        const {
          _id,
          title,
          price,
          image,
          company,
          description,
          rating,
          ratingData,
        } = product;

        const actualPrice = formatPrice(price);
        const inflatedPrice = formatPrice(price * 1.3);
        const exchangeOffer = formatPrice(price * 0.5);
        const isGoodRating = rating >= 3;

        return (
          <Link
            key={_id}
            to={`/products/${_id}`}
            className="p-4 border-2 border-base-300 rounded-lg shadow-xl hover:shadow-2xl duration-300 flex flex-col sm:flex-row gap-4 backdrop-blur-[50px]"
          >
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src={image.url}
                alt={title}
                loading="lazy"
                className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Product Info */}
            <div className="flex-grow flex flex-col justify-between gap-2">
              <h3 className="capitalize font-medium text-sm sm:text-lg">
                {title}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-white text-xs sm:text-sm ${
                    isGoodRating ? "bg-green-600" : "bg-yellow-500"
                  }`}
                >
                  <span>{rating}</span>
                  <BsStarFill className="text-white size-3" />
                </div>
                <span className="text-blue-400 text-xs sm:text-sm font-medium">
                  {ratingData?.length || 0} ratings
                </span>
              </div>

              <h4 className="capitalize text-md font-bold text-neutral-heading">
                {company.name}
              </h4>

              {/* Description - visible on md+ */}
              <div className="hidden md:block text-xs opacity-80 space-y-1">
                {description
                  .split(".")
                  .slice(0, 2)
                  .map((sentence, i) =>
                    sentence.trim() ? (
                      <p key={i}>
                        - {sentence.slice(0, 230)}
                        {sentence.length > 230 ? "..." : ""}
                      </p>
                    ) : null
                  )}
              </div>
            </div>

            {/* Pricing Info */}
            <div className="flex flex-col items-end justify-start text-right gap-1 sm:gap-2">
              <p className="text-primary text-sm sm:text-lg font-bold">
                {actualPrice}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="line-through">{inflatedPrice}</span>
                <span className="ml-2 text-green-600">30% off</span>
              </p>
              <p className="text-xs text-gray-500">Free delivery</p>
              <p className="text-xs bg-violet-300 text-violet-900 px-2 py-1 rounded-md">
                <strong>{exchangeOffer}</strong> exchange off
              </p>
              <p className="text-xs sm:text-sm text-green-600">Bank Offers</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductsList;
