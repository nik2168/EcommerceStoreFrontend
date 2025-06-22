import { useNavigate } from "react-router-dom";
import Header from "../containers/Header.jsx";
import LeftSidebar from "../containers/LeftSidebar.jsx";
import RightSidebar from "../containers/RightSidebar.jsx";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../features/user/userSlice.js";
import axios from "axios";
import { useEffect } from "react";
import { server } from "../../../features/config.js";
import Chatbot from "../../../components/AiChatBot/ChatBot.jsx";

const AdminLayout = () => (WrapComp) => {
  return (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
      axios
        .get(`${server}/api/v1/user/profile`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("nox_token")}`,
          },
        })
        .then(({ data }) => {
          // console.log(data?.user?.role)
          dispatch(loginUser(data));
          if (data?.user?.role !== "admin") {
            navigate("/login");
            toast.error("Not Authenticated !");
          }
        })
        .catch((err) => {
          console.log(err.response.data.message);
          navigate("/login");
        });
    }, []);

    return (
      <>
        <div className="drawer  lg:drawer-open">
          <input
            id="left-sidebar-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-content flex flex-col ">
            <Header />
            <main
              className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6  bg-base-200"
              // ref={mainContentRef}
            >
              <WrapComp />
              <div className="h-16"></div>
            </main>
          </div>
          <LeftSidebar />
          <RightSidebar />
          {/* <Chatbot /> */}
        </div>
      </>
    );
  };
};
export default AdminLayout;
