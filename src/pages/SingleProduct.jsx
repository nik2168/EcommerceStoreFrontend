import { useEffect, useMemo, useState } from "react";
import { BsCart3, BsStarFill } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ProductReviewSection from "../components/Product/ProductReviewSection";
import RecentViewed from "../components/RecentViewed";
import {
  useFetchRecentSearchQuery,
  useGetFashionProductsQuery,
  useGetSingleProductRecommendationMutation,
  useSingleProductQuery,
  useUpdateUserCartMutation,
  useUpdateUserInteractionsMutation
} from "../features/api";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { formatPrice, generateAmountOptions } from "../utils";

const SingleProduct = () => {
  const {user} = useSelector((state) => state.userState);
  const { id: productId } = useParams();
  const { isError, error, data, isLoading } = useSingleProductQuery(productId);
 const RecentSearched = user
   ? useFetchRecentSearchQuery()
   : useGetFashionProductsQuery();

  useErrors([
    { isError, error },
    { isError: RecentSearched?.isError, error: RecentSearched?.error},
  ]);

  const product = data?.product;
  const colors = product?.colors || ["#000"];
  const [productColor, setProductColor] = useState(colors[0]);
  const [amount, setAmount] = useState(1);
  const dispatch = useDispatch();

  const [updateUserCartMutation] = useAsyncMutation(useUpdateUserCartMutation);
  const [updateInteractionHandler] = useAsyncMutation(
    useUpdateUserInteractionsMutation,
    false
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const updateInteractions = async () => {
      await updateInteractionHandler("updating interactions ...", {
        productId,
        type: "view",
      });
    };

    if (productId) {
      updateInteractions();
    }
  }, [productId]);

  const allImages = useMemo(() => {
    return [
      product?.image?.url,
      ...(product?.extraImages?.map((img) => img.url) || []),
    ].filter(Boolean);
  }, [product]);

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % allImages.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleAmount = (e) => {
    setAmount(parseInt(e.target.value, 10));
  };

  const addToCart = async () => {
    await updateUserCartMutation("updating cart ...", {
      productId,
      quantity: amount,
    });
  };

  const [getRecommendation, isLoadingRecommendation, recommendationData] =
    useAsyncMutation(useGetSingleProductRecommendationMutation, false);
  useEffect(() => {
 
    const fetchSingleRecommendation = async () => {
    await getRecommendation("fetching recommendation ...", {productId});
    };

    fetchSingleRecommendation();
  }, [productId]);




  const dollarsAmount = formatPrice(product?.price || 14000);

  if (isLoading || RecentSearched.isLoading) return <Loading />;

  return isLoadingRecommendation ? (
    <Loading />
  ) : (
    <section>
      {/* Breadcrumbs */}
      <div className="text-md breadcrumbs">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </div>
      {/* PRODUCT MAIN */}
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16 backdrop-blur-[50px]  pb-6 px-6">
        {/* IMAGE SLIDER */}
        <div className="relative w-full lg:h-[36rem] md:h-[24rem] h-[20rem] overflow-hidden rounded-xl shadow-xl">
          {allImages.length > 0 && (
            <img
              src={allImages[current]}
              alt={`product-${current}`}
              className="w-full h-full object-cover transition-transform duration-500"
            />
          )}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-base-100/80 hover:bg-base-200 text-base-content p-2 rounded-full shadow-md z-20"
                aria-label="Previous Slide"
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-base-100/80 hover:bg-base-200 text-base-content p-2 rounded-full shadow-md z-20"
                aria-label="Next Slide"
              >
                <FaChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col ">
          <h1 className="capitalize text-3xl font-bold">{product?.title}</h1>

          {/* RATING */}
          <div className="flex flex-row justify-start my-2 items-center">
            <div
              className={`flex items-center py-1 px-3 gap-1 rounded-md ${
                product?.rating >= 3 ? "bg-green-600" : "bg-yellow-500"
              }`}
            >
              <p className="text-white text-[0.9rem] font-bold">
                {product?.rating}
              </p>
              <BsStarFill className="text-white" size={11} />
            </div>
            <p className="ml-4 text-blue-400 text-sm font-medium">
              <strong>Good</strong> {product?.ratingData?.length} ratings
            </p>
          </div>

          {/* PRICE */}
          <p className="mt-3 text-md font-bold">
            {formatPrice(product?.price - (95 / 100) * product?.price)}/month
          </p>
          <p className="leading-8 text-sm">
            24 months Cost EMI Plan with Nox-Bank Credit Card
          </p>
          <h4 className="text-xl text-neutral-content font-bold mt-2">
            <span className="text-sm font-light">a product by </span>
            {product?.company?.name}
          </h4>
          <p className="mt-3 text-xl text-primary font-bold">
            <span className="mr-2 line-through text-gray-400">
              {formatPrice(product?.price + (60 / 100) * product?.price)}
            </span>
            {dollarsAmount}
          </p>

          {/* DESCRIPTION */}
          <div className="flex flex-col p-3 my-6 rounded-md bg-base-200">
            <p className="leading-8 text-sm font-bold">Description</p>
            <p className="leading-8 text-sm">{product?.description}</p>
          </div>

          {/* COLORS */}
          <div className="mt-6">
            <h4 className="text-md font-medium capitalize">colors</h4>
            <div className="mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`badge w-6 h-6 mr-2 ${
                    color === productColor
                      ? "border-2 border-secondary bg-primary"
                      : "bg-primary"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setProductColor(color)}
                />
              ))}
            </div>
          </div>

          {/* AMOUNT */}
          <div className="form-control w-full max-w-xs">
            <label className="label" htmlFor="amount">
              <h4 className="text-md font-medium capitalize">amount</h4>
            </label>
            <select
              className="select select-secondary select-bordered select-md"
              id="amount"
              value={amount}
              onChange={handleAmount}
            >
              {generateAmountOptions(10)}
            </select>
          </div>

          {/* CART BUTTON */}
          <div className="mt-10 flex gap-6">
            {/* <button className="btn btn-primary btn-md" onClick={addToCart}>
              <FaBuysellads className="mr-2 size-6" /> Buy Now
            </button> */}
            <button className="btn btn-primary btn-md" onClick={addToCart}>
              <BsCart3 className="mr-2 size-6" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
      <ProductReviewSection product={product} />

      <RecentViewed
        title={"Recommendations"}
        data={recommendationData}
        isLoading={isLoadingRecommendation}
      />
      <RecentViewed
        data={RecentSearched.data}
        isLoading={RecentSearched.isLoading}
        isScrollable={false}
      />
    </section>
  );
};

export default SingleProduct;
