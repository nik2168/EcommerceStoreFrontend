import { Link, redirect, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../features/user/userSlice";
import FormInput from "../components/FormInput";
import SubmitBtn from "../components/SubmitBtn";
import axios from "axios";
import { server } from "../features/config";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyFetchUserCartQuery } from "../features/api";
import { setCart } from "../features/cart/cartSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fetchUserCart] = useLazyFetchUserCartQuery();

  const fetchCart = async () => {
    try {
      const triggerFetch = await fetchUserCart().unwrap(); // properly unwrap lazy query
      dispatch(setCart(triggerFetch?.cartData?.products || []));
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing In...");

    const config = {
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        { email, password },
        config
      );

      dispatch(loginUser(data));
      toast.success(data?.message, { id: toastId });

      // Wait for cart to fetch before navigating
      await fetchCart();

      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "something went wrong !", {
        id: toastId,
      });
    }
  };

  const loginAsGuestUser = async () => {
    navigate("/");
  };

  return (
    <section className="h-screen grid place-items-center">
      <form
        id="login"
        className="card w-96  p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
        <FormInput
          type="email"
          label="email"
          name="identifier"
          value={email}
          setValue={setEmail}
        />
        <FormInput
          type="password"
          label="password"
          name="password"
          value={password}
          setValue={setPassword}
        />
        <div className="mt-4">
          <SubmitBtn
            text="login"
            handleClick={loginHandler}
            isSubmitting={isSubmitting}
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={loginAsGuestUser}
        >
          Skip
        </button>
        <p className="text-center">
          Not a member yet?{" "}
          <Link
            to="/register"
            className="ml-2 link link-hover link-primary capitalize"
          >
            register
          </Link>
        </p>
      </form>
    </section>
  );
};
export default Login;
