import { formatPrice, generateAmountOptions } from "../utils";
import { useDispatch } from "react-redux";
import {
  useRemoveCartItemMutation,
  useUpdateUserCartMutation,
} from "../features/api";
import { useAsyncMutation } from "../hooks/hook";

const CartItem = ({ cartItem }) => {
  const dispatch = useDispatch();
  const { _id, title, price, image, company, colors } = cartItem.product;
  const amount = cartItem.quantity;

  const [removeCartItemMutation] = useAsyncMutation(useRemoveCartItemMutation);
  const [updateUserCartMutation] = useAsyncMutation(useUpdateUserCartMutation);

  const removeItemFromTheCart = async () => {
    await removeCartItemMutation("removing item ...", { id: _id });
  };

  const handleAmount = async (e) => {
    const quantity = Number(e.target.value);
    await updateUserCartMutation("updating cart ...", {
      productId: _id,
      quantity,
    });
  };

  return (
    <article className="flex flex-col md:flex-row items-center justify-center gap-6 border-b border-base-300 p-3 mb-8 rounded-3xl my-6 shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500">
      {/* Image */}
      <div className="flex justify-center items-center w-full md:w-48">
        <img
          src={image.url}
          alt={title}
          className="w-[38rem] h-[12rem] object-cover rounded-xl shadow"
        />
      </div>

      {/* Info */}
      <div className="flex flex-row gap-6 justify-around w-[70%] items-center ">
        <div className="flex flex-col items-center justify-center md:justify-start gap-2 text-sm">
          <h3 className="text-lg font-semibold capitalize text-base-content">
            {title}
          </h3>
          <p className="text-sm text-muted">
            <span className="font-light text-xs">by</span> {company.name}
          </p>
          <span>Color:</span>
          <span
            className="w-5 h-5 rounded-full border-2 border-primary"
            style={{ backgroundColor: colors[0] }}
          ></span>
        </div>
        <div className="flex flex-col  justify-ceter items-center gap-4">
          <div className="form-control w-32">
            <label
              htmlFor="amount"
              className="label p-0 mb-1 text-xs text-base-content"
            >
              Quantity
            </label>
            <select
              name="amount"
              id="amount"
              className="select select-bordered select-sm"
              value={amount}
              onChange={handleAmount}
            >
              {generateAmountOptions(amount + 5)}
            </select>
          </div>

          <button
            onClick={removeItemFromTheCart}
            className="mt-2 sm:mt-0 text-sm text-red-600 hover:text-red-800 underline underline-offset-2 transition"
          >
            Remove
          </button>
        </div>
        {/* Price */}
        <div className="text-lg font-bold text-primary text-center md:text-right md:w-24">
          {formatPrice(price)}
        </div>
      </div>
    </article>
  );
};

export default CartItem;
