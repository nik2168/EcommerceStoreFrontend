import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

const HomeLayout = () => {
  // const {isPageLoading} = useSelector((state) => state.loadingState);
  // // console.log(isPageLoading);
  const isPageLoading = false

  return (
    <>
      <Header />
      <Navbar />
      {isPageLoading ? (
        <Loading />
      ) : (
        <section className="align-element py-20">
          <Outlet />
        </section>
      )}
    </>
  );
};
export default HomeLayout;
