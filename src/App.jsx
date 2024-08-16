import { BrowserRouter, Route, Routes } from "react-router-dom";
// import {
//   About,
//   Cart,
//   Checkout,
//   Error,
//   HomeLayout,
//   Landing,
//   Login,
//   Orders,
//   Products,
//   Register,
//   SingleProduct,
// } from "./pages";
import HomeLayout from "./pages/HomeLayout";
import ProtectRoute from "./auth/ProtectRoute";
import Login from "./pages/Login";
  import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Register from "./pages/Register";



const App = () => {
  const user = useSelector((state) => state.userState);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectRoute user={user} />}>
          <Route path="/" element={<HomeLayout />} />
          {/* <Route path="/" element={<HomeLayout />} />
          <Route path="/" element={<HomeLayout />} /> */}
        </Route>
        <Route
          path="/login"
          element={
            <ProtectRoute user={user} redirect="/">
              <Login />
            </ProtectRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectRoute user={user} redirect="/">
              <Register/>
            </ProtectRoute>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};
export default App;
