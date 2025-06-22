import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateNewOrderMutation } from "../features/api";
import { useAsyncMutation } from "../hooks/hook";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import axios from "axios";
import { server } from "../features/config";
import toast from "react-hot-toast";

const CheckoutForm = () => {
  const { cartItems, orderTotal, numItemsInCart } = useSelector(
    (state) => state.cartState
  );

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const createOrderHandler = async (e) => {
    e.preventDefault();

    const cartItemsIds = cartItems.map((item) => {
      return {
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    const toastId = toast.loading("redirecting to payment page...");
    const body = {
      amount: orderTotal * 100,
      currency: "USD",
      quantity: 1,
      paymentTypes: ["card"],
      name,
      address,
      phone,
      cartItems: JSON.stringify(cartItemsIds),
    };

    const token = localStorage.getItem("nox_token");
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/order/create`,
        body,
        config
      );
      toast.success(data?.message, { id: toastId });
      console.log(data?.orderId);
      window.location.href = `${data?.orderId}`;
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "something went wrong !", {
        id: toastId,
      });
    }
  };

  return (
    <form className="flex flex-col gap-y-4">
      <h4 className="font-medium text-xl capitalize">shipping information</h4>
      <FormInput
        label="first name"
        name="name"
        type="text"
        value={name}
        setValue={setName}
      />
      <FormInput
        label="address"
        name="address"
        type="text"
        value={address}
        setValue={setAddress}
      />
      <FormInput
        label="phone"
        name="phone"
        type="tel"
        value={phone}
        setValue={setPhone}
      />
      <div className="mt-4">
        <SubmitBtn
          text="place your order"
          handleClick={(e) => createOrderHandler(e)}
        />
      </div>
    </form>
  );
};
export default CheckoutForm;

// export const action =
//   (store, queryClient) =>
//   async ({ request }) => {
//     const formData = await request.formData();
//     const { name, address } = Object.fromEntries(formData);
//     const user = store.getState().userState.user;
//     const { cartItems, orderTotal, numItemsInCart } =
//       store.getState().cartState;

//     const info = {
//       name,
//       address,
//       chargeTotal: orderTotal,
//       orderTotal: formatPrice(orderTotal),
//       cartItems,
//       numItemsInCart,
//     };

//     try {
//       const response = await customFetch.post(
//         '/orders',
//         { data: info },
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );
//       queryClient.removeQueries(['orders']);
//       store.dispatch(clearCart());
//       toast.success('order placed successfully');
//       return redirect('/orders');
//     } catch (error) {
//       console.log(error);
//       const errorMessage =
//         error?.response?.data?.error?.message ||
//         'there was an error placing your order';
//       toast.error(errorMessage);
//       if (error?.response?.status === 401 || 403) return redirect('/login');
//       return null;
//     }
//   };
