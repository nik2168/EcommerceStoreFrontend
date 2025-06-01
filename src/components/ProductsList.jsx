

import { Link } from 'react-router-dom';
import { formatPrice } from '../utils';
import { BsStarFill } from 'react-icons/bs';
// import { productData } from '../data/data';

const ProductsList = ({data}) => {
  const products = data;

  return (
    <div className='mt-8 grid gap-y-3'>
      {products.map((product) => {
        const { title, price, image, company, description } = product;
        const dollarsAmount = formatPrice(price);
        const incPrice = formatPrice(Number(price) + (Number(price) * 0.3));
        return (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="p-2 md:p-4 lg:p-4 w-full border-2 border-base-300  rounded-lg backdrop-blur-[50px] flex flex-row gap-y-4  shadow-xl hover:shadow-2xl duration-300 "
          >
            <div className="md:w-[40%] lg:w-[20%] mr-3 h-auto">
              <img
                src={image.url}
                alt={title}
                className="h-[8rem] w-[8rem] rounded-lg md:h-[15rem] md:w-[15rem] lg:h-52 lg:w-52 object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="ml-0 s w-[30%] md:w-[60%] lg:w-[60%] h-[9rem] ">
              <h3 className="capitalize font-medium text-sm md:text-lg  lg:text-lg">
                {title}
              </h3>
              <div className="flex flex-row justify-start mt-3  items-center">
                <div
                  className={`flex flex-row justify-center items-center py-1 px-2 md:px-3 lg:px-3 gap-1 rounded-md ${
                    product?.rating >= 3 ? " bg-green-600" : " bg-yellow-500"
                  }`}
                >
                  <p className="text-white text-[0.7rem] md:text-[0.9rem] lg:text-[0.9rem]  font-bold">
                    {product?.rating}
                  </p>
                  <BsStarFill className="text-white size-2" />
                </div>

                <p className="ml-2 text-blue-400 text-[0.7rem] md:text-[0.9rem] lg:text-[0.9rem] font-medium">
                  {product?.ratingData?.length} ratings
                </p>
              </div>
              <h4 className="capitalize text-md font-bold my-3  text-neutral-heading">
                {company.name}
              </h4>
              <div className="md:visible lg:visible invisible">
                {description.split(".").map((i) => {
                  return (
                    <p className="text-xs  text-wrap">
                      - {i.slice(0, 230)}
                      {i.length > 230 ? "..." : ""}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="w-[50%] md:w-[40%] lg:w-[40%] flex flex-col items-end gap-1 sm:w-full justify-start">
              <p className=" ml-0 text-primary sm:ml-auto text-sm md:text-lg lg:text-lg font-bold">
                {dollarsAmount}
              </p>
              <p className=" text-xs md:text-sm lg:text-sm ">
                <span className="line-through">{incPrice}</span>{" "}
                <span className="text-green-600 ml-3 ">30% off </span>
              </p>
              <p className=" ml-0 sm:ml-auto text-xs "> free delivery</p>
              <p className="  text-xs md:text-xs lg:text-xs bg-violet-300 text-violet-900 px-2 py-1 rounded-md">
                {" "}
                <strong>{formatPrice(price * 0.5)}</strong> exchange off
              </p>
              <p className=" ml-0 sm:ml-auto text-xs md:text-sm lg:text-sm text-green-600 ">
                {" "}
                Bank Offers
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
export default ProductsList;
