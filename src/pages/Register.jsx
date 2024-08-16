import toast from "react-hot-toast";
import { Link, redirect, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import SubmitBtn from "../components/SubmitBtn";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { server } from "../features/config";
import { loginUser } from "../features/user/userSlice";

// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const data = Object.fromEntries(formData);

//   try {
//     const response = await customFetch.post('/auth/local/register', data);
//     toast.success('account created successfully');
//     return redirect('/login');
//   } catch (error) {
//     const errorMessage =
//       error?.response?.data?.error?.message ||
//       'please double check your credentials';
//     toast.error(errorMessage);
//     return null;
//   }
// };

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
      console.log(data.user, data.token);
      toast.success(data?.message, { id: toastId });
    } catch (err) {
        console.log(err)
      toast.error(err?.response?.data?.message || "something went wrong !", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="h-screen grid place-items-center">
      <form id="register" className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4">
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
