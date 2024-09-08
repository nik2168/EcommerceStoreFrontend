import { useLoaderData, useParams } from 'react-router-dom';
import { formatPrice, customFetch, generateAmountOptions } from '../utils';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';
import { useErrors } from '../hooks/hook';
import { useSingleProductQuery } from '../features/api';
import Loading from '../components/Loading';

// const singleProductQuery = (id) => {
//   return {
//     queryKey: ['singleProduct', id],
//     queryFn: () => customFetch(`/products/${id}`),
//   };
// };

// export const loader =
//   (queryClient) =>
//   async ({ params }) => {
//     const response = await queryClient.ensureQueryData(
//       singleProductQuery(params.id)
//     );

//     return { product: response.data.data };
//   };
// const product = [{
//   name: "Iphone",
//   image: "",
//   title: "price",
//   description: "jhgstuihquitf",
//   color: ["#000000"],
//   company: "Apple"
// }]

const SingleProduct = () => {
const params = useParams()
const productId = params.id

 const{isError, error, data, isLoading, refetch} = useSingleProductQuery({productId : productId.toString()})
useErrors([{isError, error}])

 const product = data?.product;
 const colors = product?.colors || ['#000'];

  // const { image, title, price, description, colors, company } =
  //   product;
  const dollarsAmount = formatPrice(product?.price || 14000);
  const [productColor, setProductColor] = useState(colors[0]);
  const [amount, setAmount] = useState(1);

  const handleAmount = (e) => {
    setAmount(parseInt(e.target.value));
  };

  const cartProduct = {
    cartID: product?._id,
    productID: productId,
    image: product?.image,
    title: product?.title,
    price: product?.price,
    company: product?.company?.name,
    productColor: productColor,
    amount,
  };

  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch(addItem({ product: cartProduct || {} }));
    
  };

  return isLoading ? (
    <Loading />
  ) : (
    <section>
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
      {/* PRODUCT */}
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        {/* IMAGE */}
        <img
          src={product?.image}
          alt={product?.title}
          className="w-96 h-96 object-cover rounded-lg lg:w-full"
        />
        {/* PRODUCT */}
        <div>
          <h1 className="capitalize text-3xl font-bold">{product?.title}</h1>
          <h4 className="text-xl text-neutral-content font-bold mt-2">
            {product?.company?.name}
          </h4>
          <p className="mt-3 text-xl">{dollarsAmount}</p>
          <p className="mt-6 leading-8">{product?.description}</p>
          {/* COLORS */}
          <div className="mt-6">
            <h4 className="text-md font-medium tracking-wider capitalize">
              colors
            </h4>
            <div className='mt-2'>
              {product?.colors?.map((color) => {
                return (
                  <button
                    key={color}
                    type='button'
                    className={`badge w-6 h-6 mr-2 ${
                      color === color && 'border-2 border-secondary'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setProductColor(color)}
                  ></button>
                );
              })}
            </div>
          </div>
          {/* AMOUNT */}
          <div className="form-control w-full max-w-xs">
            <label className="label" htmlFor="amount">
              <h4 className="text-md font-medium -tracking-wider capitalize">
                amount
              </h4>
            </label>
            <select
              className="select select-secondary select-bordered select-md"
              id="amount"
              value={product?.amount}
              onChange={handleAmount}
            >
              {generateAmountOptions(20)}
            </select>
          </div>
          {/* CART BTN */}
          <div className="mt-10">
            <button className="btn btn-secondary btn-md" onClick={addToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SingleProduct;
