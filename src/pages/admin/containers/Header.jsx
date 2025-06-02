// import { themeChange } from 'theme-change'
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../../features/api";
import { openRightDrawer } from "../../../features/notification/rightDrawerSlice";
import { toggleTheme } from "../../../features/user/userSlice";
import { useAsyncMutation } from "../../../hooks/hook";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const {onlineUsers} = useSelector((state) => state.userState);
    const {user} = useSelector((state) => state.userState);
  

  const { theme } = useSelector((state) => state.userState);
  const currentTheme = theme;

  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  const { noOfNotifications, pageTitle } = useSelector(
    (state) => state.headerState
  );

  // const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))

  // useEffect(() => {
  //     themeChange(false)
  //     if(currentTheme === null){
  //         if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
  //             setCurrentTheme("dark")
  //         }else{
  //             setCurrentTheme("light")
  //         }
  //     }
  //     // 👆 false parameter is required for react project
  //   }, [])

  //   Opening right sidebar for notification
  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
  };

  const [logoutAdminHandler] = useAsyncMutation(useLogoutUserMutation);

  const logoutUser = async () => {
    await logoutAdminHandler("logging out admin ...", {});
    navigate("/login");
  };

  return (
    // navbar fixed  flex-none justify-between bg-base-300  z-10 shadow-md

    <>
      <div className="navbar sticky top-0 bg-base-100  z-10 shadow-md ">
        {/* Menu toogle for mobile view or small screen */}
        <div className="flex-1">
          <label
            htmlFor="left-sidebar-drawer"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <Bars3Icon className="h-5 inline-block w-5" />
          </label>
          <h1 className="text-md md:text-xl hidden md:flex lg:flex  lg:text-2xl font-semibold ml-2">{pageTitle}</h1>

          <div className="group flex items-center transition-all duration-1000 z-10 cursor-pointer justify-center space-x-1  p-[10px] rounded-full absolute right-[50%] md:right-[50%] lg:right-[50%]">
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
                    key={usr.id}
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
        </div>

        <div className="flex-none ">
          {/* Multiple theme selection, uncomment this if you want to enable multiple themes selection, 
                also includes corporate and retro themes in tailwind.config file */}

          {/* <select className="select select-sm mr-4" data-choose-theme>
                    <option disabled selected>Theme</option>
                    <option value="light">Default</option>
                    <option value="dark">Dark</option>
                    <option value="corporate">Corporate</option>
                    <option value="retro">Retro</option>
                </select> */}

          {/* Light and dark theme selection toogle **/}
          <label className="swap ">
            <input type="checkbox" />
            {theme === "dark" ? (
              <SunIcon
                //   data-set-theme="light"
                data-act-class="ACTIVECLASS"
                className={"fill-current w-6 h-6 "}
                onClick={() => handleTheme()}
              />
            ) : (
              <MoonIcon
                //   data-set-theme="dark"
                data-act-class="ACTIVECLASS"
                onClick={() => handleTheme()}
                className={"fill-current w-6 h-6 "}
              />
            )}
          </label>

          {/* Notification icon */}
          <button
            className="btn btn-ghost ml-4  btn-circle"
            onClick={() => openNotification()}
          >
            <div className="indicator">
              <BellIcon className="h-6 w-6" />
              {noOfNotifications > 0 ? (
                <span className="indicator-item badge badge-secondary badge-sm">
                  {noOfNotifications}
                </span>
              ) : null}
            </div>
          </button>

          {/* Profile icon, opening menu on click */}
          <div className="dropdown dropdown-end ml-4">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src="https://reqres.in/img/faces/2-image.jpg"
                  alt="profile"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="justify-between">
                <Link to={"/admin/settings"}>
                  Profile Settings
                  <span className="badge">New</span>
                </Link>
              </li>
              <li className="justify-between">
                <Link to={"/"}>Website</Link>
              </li>
              {/* <li className="">
                <Link to={"/app/settings-billing"}>Bill History</Link>
              </li> */}
              <div className="divider mt-0 mb-0"></div>
              <li>
                <button onClick={() => logoutUser()}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
