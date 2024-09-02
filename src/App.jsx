import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { lazy, Suspense } from "react";

import HomeLayout from "./pages/HomeLayout";
import ProtectRoute from "./auth/ProtectRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Loading from "./components/Loading";



const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"))
const Cart = lazy(() => import('./pages/Cart'))

const App = () => {
  const { user } = useSelector((state) => state.userState);

  return (
    <BrowserRouter>
    <Suspense fallback={<Loading/>}>

      <Routes>
        <Route element={<ProtectRoute user={user} />}>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Landing />} />
            <Route path="/about" element={<About />}/>
            <Route path="/products" element={<Products />}/>
            <Route path="/products/:id" element={<SingleProduct />}/>
            <Route path="/cart" element={<Cart />}/>
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

        <Route path="*" element={<NotFound />} />
      </Routes>
          </Suspense>
      <Toaster />
    </BrowserRouter>
  );
};
export default App;
