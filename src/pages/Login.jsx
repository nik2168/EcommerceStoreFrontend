import { Link, redirect, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../features/user/userSlice";
import FormInput from "../components/FormInput";
import SubmitBtn from "../components/SubmitBtn";
import axios from "axios";
import { server } from "../features/config";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// export const action =
//   (store) =>
//   async ({ request }) => {
//     const formData = await request.formData();
//     const data = Object.fromEntries(formData);

//     try {
//       const response = await customFetch.post('/auth/local', data);
//       store.dispatch(loginUser(response.data));
//       toast.success('logged in successfully');
//       return redirect('/');
//     } catch (error) {
//       const errorMessage =
//         error?.response?.data?.error?.message ||
//         'please double check your credentials';
//       toast.error(errorMessage);
//       return null;
//     }
//   };

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing In...");

    setIsSubmitting(true);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer ' + token
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
    } catch (err) {
      toast.error(err?.response?.data?.message || "something went wrong !", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginAsGuestUser = async (formdata) => {
    console.log("Hello Guest !");
    // try {
    //   // const response = await axios()
    //   const response = await customFetch.post('/auth/local', {
    //     identifier: 'test@test.com',
    //       password: 'secret',
    //     });
    //     dispatch(loginUser(response.data));
    //     toast.success('welcome guest user');
    //     navigate('/');
    //   } catch (error) {
    //     console.log(error);
    //     toast.error('guest user login error. please try again');
    //   }
  };

  return (
    <section className="h-screen grid place-items-center">
      <form id="login" className="card w-96  p-8 bg-base-100 shadow-lg flex flex-col gap-y-4">
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
          guest user
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
