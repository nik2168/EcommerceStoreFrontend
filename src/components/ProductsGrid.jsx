import { Link } from "react-router-dom";
import { formatPrice } from '../utils';
import { BsStarFill } from "react-icons/bs";

const ProductsGrid = ({ data }) => {
  const products = data;



  return (
    <div className="pt-6  grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ">
      {products?.map((product) => {
        const { title, price, image, rating, ratingData } = product;
        const dollarsAmount = formatPrice(price);
        return (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="card w-full shadow-xl border border-base-300 rounded-lg   backdrop-blur-[50px] hover:shadow-2xl transition duration-300"
          >
            <figure className="px-4 pt-4">
              <img
                src={image.url}
                alt={title}
                className="rounded-xl  md:h-[15rem] lg:h-[13rem] h-[10rem] w-auto object-cover"
              />
            </figure>

            <div className="flex flex-row justify-start mt-3 pl-6  items-center">
              <div
                className={`flex flex-row justify-center items-center py-1 px-3 gap-1 rounded-md ${
                  product?.rating >= 3 ? " bg-green-600" : " bg-yellow-500"
                }`}
              >
                <p className="text-white text-[0.9rem]  font-bold">
                  {product?.rating}
                </p>
                <BsStarFill className="text-white" size={11} />
              </div>

              <p className="ml-2 text-blue-400 text-sm font-medium">
                {product?.ratingData?.length} ratings
              </p>
            </div>

            <div className="card-body justify-start items-start text-start p-1 pb-6 px-6">
              <h2 className="text-sm font-bold md:card-title lg:card-title capitalize tracking-wider ">
                {title}
              </h2>
              <span className="text-sm text-green-500 md:text-secondary lg:text-secondary text-start">
                {dollarsAmount}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
export default ProductsGrid;
