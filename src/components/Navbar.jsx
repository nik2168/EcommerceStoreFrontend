import { BsCart, BsCart3, BsMoonFill, BsSunFill } from "react-icons/bs";
import { FaBarsStaggered } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import NavLinks from "./NavLinks";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/user/userSlice";
import faceId from "../assets/faceId.json";
import Lottie from "react-lottie-player";

const Navbar = () => {
  const { onlineUsers } = useSelector((state) => state.userState);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userState);

  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  const numItemsInCart = useSelector((state) => state.cartState.numItemsInCart);

  return (
    <nav className="sticky w-[95%] md:w-[90%] lg:w-[90%] top-2 z-50 bg-base-200 bg-opacity-40 backdrop-blur-lg shadow-lg rounded-xl mx-auto flex justify-space-between my-2">
      <div className="navbar p-3">
        {/* START */}
        <div className="navbar-start">
          <NavLink
            to="/"
            className="hidden lg:flex shadow-lg flex-col text-3xl font-bold btn  bg-primary bg-opacity-40  btn-ghost text-content-300 tracking-wide"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <BsCart />
            Nox Cart
          </NavLink>

          <div className="dropdown lg:hidden">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-sm bg-primary bg-opacity-50 "
            >
              <FaBarsStaggered className="h-5 w-5 text-white" />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg rounded-box w-52 bg-gray-900 bg-opacity-60 backdrop-blur-lg  text-white"
            >
              <NavLinks />
            </ul>
          </div>
        </div>

        {/* CENTER */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <NavLinks
              renderLink={({ to, label }) => (
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `btn btn-ghost px-4 py-2 rounded-xl transition duration-300 ${
                      isActive
                        ? "bg-white bg-opacity-10 text-white"
                        : "hover:bg-white hover:bg-opacity-5 text-gray-300"
                    }`
                  }
                >
                  {label}
                </NavLink>
              )}
            />
          </ul>
        </div>

        {/* END */}
        <div className="navbar-end gap-2 relative">
          <div className="group flex items-center transition-all duration-1000 z-10 cursor-pointer justify-center space-x-1  p-[10px] rounded-full absolute right-[100%] md:right-[50%] lg:right-[50%]">
            <span className="relative flex h-2 w-2 md:h-3 md:w-3 lg:h-3 lg:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 lg:h-3 lg:w-3 bg-green-500"></span>
            </span>
            <p className="text-[0.7rem] md:text-sm lg:text-sm w-[3.5rem] font-light text-white pl-1">
              {onlineUsers?.length || 1} <span className="">online</span>
            </p>

            {/* Hoverable name list */}
            <div
              id="users-name"
              className=" group-hover:flex justify-center items-center group-hover:w-[12rem] group-hover:h-[12rem]  h-[2.3rem] md:h-[2.5rem] lg:h-[2.5rem] top-0  absolute  z-[-1] flex-col gap-1  bg-primary bg-opacity-40 shadow-lg transition-all duration-1000 p-3 rounded-3xl group-hover:rounded-3xl w-[6rem] md:w-[6rem] lg:w-[6rem] backdrop-blur-lg"
            >
              <div className="flex-col items-start justify-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:delay-[900ms] delay-[0ms]">
                {onlineUsers?.map((usr, index) => (
                  <div
                    key={usr.id + { index }}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary backdrop-blur-md text-white shadow-lg transform transition-all duration-500 ease-out opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0"
                    style={{
                      transitionDelay: `calc(${index * 100}ms + 900ms)`,
                    }}
                  >
                    <span className="text-[0.7rem] md:text-[0.7rem] lg:text-[0.7rem] font-medium">
                      {usr.name}
                    </span>

                    {usr.role === "admin" && (
                      <span className="text-xs font-semibold text-green-400  px-2 py-[2px] rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Theme toggle wrapped with dark translucent bg */}
          <div className="rounded-full  bg-primary bg-opacity-40 shadow-lg hover:bg-opacity-20 transition-all backdrop-blur-sm">
            <label className="swap swap-rotate cursor-pointer p-2 md:p-3 lg:p-3 flex justify-center items-center">
              <input type="checkbox" onChange={handleTheme} />
              <BsSunFill className="swap-on w-5 h-5 text-yellow-400" />
              <BsMoonFill className="swap-off w-5 h-5 text-blue-500 text-opacity-100" />
            </label>
          </div>

          {/* Cart icon with dark translucent bg */}
          <NavLink
            to="/cart"
            className="btn btn-circle btn-ghost btn-md  text-white relative shadow-lg bg-primary bg-opacity-40  backdrop-blur-sm"
          >
            <div className="indicator">
              <BsCart3 className="h-6 w-6" />
              {numItemsInCart > 0 && (
                <span className="badge badge-sm badge-primary absolute top-[-0.4rem] right-[-0.4rem]">
                  {numItemsInCart}
                </span>
              )}
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
