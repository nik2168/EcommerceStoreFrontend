import toast from "react-hot-toast";
import { Link, redirect, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import SubmitBtn from "../components/SubmitBtn";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { server } from "../features/config";
import { loginUser } from "../features/user/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { useLazyFetchUserCartQuery } from "../features/api";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userState);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const singupHandler = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");

    setIsSubmitting(true);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/signup`,
        { email, password, username },
        config
      );
      dispatch(loginUser(data));
      toast.success(data?.message, { id: toastId });
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "something went wrong !", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [fetchUserCart] = useLazyFetchUserCartQuery();

  const fetchCart = async () => {
    try {
      const triggerFetch = await fetchUserCart().unwrap(); // properly unwrap lazy query
      dispatch(setCart(triggerFetch?.cartData?.products || []));
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const toastId = toast.loading("Signing in with Google...");

      try {
        const { data } = await axios.post(
          `${server}/api/v1/user/auth/google`,
          {
            code: tokenResponse.code, // ✅ send access_token
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        dispatch(loginUser(data));
        toast.success(data?.message, { id: toastId });

        await fetchCart();
        navigate("/");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Google login failed!", {
          id: toastId,
        });
      }
    },
    scope: "profile email openid", // ✅ optional but helpful
    flow: "auth-code", // ✅ required for access_token flow
    onError: (err) => {
      console.error("Google Login Error", err);
      toast.error("Google Sign-In Failed");
    },
  });

  return (
    <section className="h-screen grid place-items-center">
      <form
        id="register"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Register</h4>
        <FormInput
          type="text"
          label="username"
          name="username"
          value={username}
          setValue={setUsername}
        />
        <FormInput
          type="email"
          label="email"
          name="email"
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
            text="register"
            handleClick={singupHandler}
            isSubmitting={isSubmitting}
          />
        </div>
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          class="flex justify-center items-center gap-3 px-5 py-2.5 mb-6 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.3H272v95.2h146.9c-6.4 34.7-25.5 64.1-54.5 83.6v69.3h87.9c51.5-47.4 81.2-117.3 81.2-197.8z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c73.5 0 135-24.5 180-66.7l-87.9-69.3c-24.4 16.3-55.5 25.9-92.1 25.9-70.8 0-130.8-47.9-152.3-112.1H29.6v70.6c44.6 89.6 137.8 151.6 242.4 151.6z"
              fill="#34A853"
            />
            <path
              d="M119.7 321.9c-10.5-31.4-10.5-65.3 0-96.7V154.6H29.6c-33.2 65.7-33.2 143.9 0 209.6l90.1-70.6z"
              fill="#FBBC05"
            />
            <path
              d="M272 107.7c39.9 0 75.9 13.8 104.1 40.9l78.1-78.1C407 24.5 345.5 0 272 0 167.4 0 74.2 61.9 29.6 151.6l90.1 70.6C141.2 155.6 201.2 107.7 272 107.7z"
              fill="#EA4335"
            />
          </svg>
          <span class="text-gray-700 font-medium">Sign Up with Google</span>
        </button>
        <p className="text-center">
          Already a member?
          <Link
            to="/login"
            className="ml-2 link link-hover link-primary capitalize"
          >
            login
          </Link>
        </p>
      </form>
    </section>
  );
};
export default Register;
