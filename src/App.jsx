import { Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectRoute from "./auth/ProtectRoute";
import Loading from "./components/Loading";
import { useFetchUserCartQuery } from "./features/api";
import { setCart } from "./features/cart/cartSlice";
import HomeLayout from "./pages/HomeLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

import axios from "axios";
import { server } from "./features/config.js";
import { loginUser, logoutUser } from "./features/user/userSlice.js";
import { useErrors } from "./hooks/hook.jsx";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Analytics from "./pages/admin/Analytics/Analytics.jsx";
import Settings from "./pages/admin/Settings/Settings.jsx";
import Dashboard from "./pages/admin/dashboard/Dashboard.jsx";
import AddCategory from "./pages/admin/database/Category/AddCategory.jsx";
import Category from "./pages/admin/database/Category/Category.jsx";
import SingleCategory from "./pages/admin/database/Category/SingleCategory.jsx";
import AddCompany from "./pages/admin/database/Company/AddCompany.jsx";
import Company from "./pages/admin/database/Company/Company.jsx";
import SingleCompany from "./pages/admin/database/Company/SingleCompany.jsx";
import AddProductAdmin from "./pages/admin/database/Product/AddProductAdmin.jsx";
import Product from "./pages/admin/database/Product/Product.jsx";
import SingleProductAdmin from "./pages/admin/database/Product/SingleProductAdmin.jsx";
import Transactions from "./pages/admin/transactions/Transaction.jsx";
import PaymentSuccess from "./components/order/OrderSuccess.jsx";
import PaymentCancel from "./components/order/OrderFail.jsx";
import AdminProtectedRoute from "./auth/AdminProtectedRoute.jsx";

const App = () => {
  const { user } = useSelector((state) => state.userState);

  const dispatch = useDispatch();

  // Fetch Cart Data from the server and set it in the Redux store
  const { isLoading, data, isError, error, refetch } = useFetchUserCartQuery(
    {}
  );

  useErrors([{ isError, error }]);

  if (!isLoading && data) {
    dispatch(setCart(data.cartData.products));
  }

  useEffect(() => {
    const token = localStorage.getItem("nox_token");

    axios
      .get(`${server}/api/v1/user/profile`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        // console.log(data?.user?.role)
        dispatch(loginUser(data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(logoutUser());
      });
  }, [dispatch]);

  //  if(user.role === "admin") navigate("/admin/dashboard");

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route element={<ProtectRoute user={user} />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/success" element={<PaymentSuccess />} />
              <Route path="/order/cancel" element={<PaymentCancel />} />
            </Route>
          </Route>

          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />

          <Route
            path="/register"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Register />
              </ProtectRoute>
            }
          />

          <Route element={<AdminProtectedRoute user={user} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/transactions" element={<Transactions />} />
            <Route path="/admin/product" element={<Product />} />
            <Route path="/admin/product/add" element={<AddProductAdmin />} />
            <Route path="/admin/product/:id" element={<SingleProductAdmin />} />
            <Route path="/admin/category" element={<Category />} />
            <Route path="/admin/category/add" element={<AddCategory />} />
            <Route path="/admin/category/:id" element={<SingleCategory />} />
            <Route path="/admin/company" element={<Company />} />
            <Route path="/admin/company/add" element={<AddCompany />} />
            <Route path="/admin/company/:id" element={<SingleCompany />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
};
export default App;
