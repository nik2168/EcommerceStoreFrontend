import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { setPageTitle } from "../../../features/adminHeader/headerSlice.js";
import AdminLayout from "../AdminLayout/AdminLayout.jsx";
import TitleCard from "../components/Cards/TitleCard.jsx";
import SearchBar from "../components/Input/SearchBar.jsx";
import { useAdminOrdersDataQuery } from "../../../features/api.js";
import { useErrors } from "../../../hooks/hook.jsx";
import Loading from "../../../components/Loading.jsx";
import debounce from "lodash.debounce";

const TopSideButtons = ({ search, setSearch }) => {
  const dispatch = useDispatch();
  const [filterParam, setFilterParam] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(setPageTitle({ title: "Transactions" }));
  }, []);

  useEffect(() => {
    const debounceSearch = debounce(() => setSearch(searchText), 400);
    debounceSearch();
    return () => debounceSearch.cancel();
  }, [searchText]);

  return (
    <div className="inline-block float-right">
      <SearchBar
        searchText={searchText}
        placeholderText={"search by name ..."}
        styleClass="mr-4"
        setSearchText={setSearchText}
      />
      {filterParam && (
        <button
          onClick={() => setFilterParam("")}
          className="btn btn-xs mr-2 btn-active btn-ghost normal-case"
        >
          {filterParam}
          <XMarkIcon className="w-4 ml-2" />
        </button>
      )}
      <div className="dropdown dropdown-bottom dropdown-end">
        <label tabIndex={0} className="btn btn-sm btn-outline">
          <FunnelIcon className="w-5 mr-2" />
          Filter
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-10 menu p-2 text-sm shadow bg-base-100 rounded-box w-52"
        >
          {["Pending", "Delivered", "Failed"].map((status, idx) => (
            <li key={idx}>
              <a onClick={() => setFilterParam(status)}>{status}</a>
            </li>
          ))}
          <div className="divider mt-0 mb-0"></div>
          <li>
            <a onClick={() => setFilterParam("")}>Remove Filter</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Transactions = () => {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const observer = useRef();

  const { data, isError, error, isLoading, isFetching } =
    useAdminOrdersDataQuery({ page, search });

  useErrors([{ isError, error }]);

  useEffect(() => {
    if (data?.userOrders) {
      if (page === 1) {
        setOrders(data.userOrders);
      } else {
        setOrders((prev) => [...prev, ...data.userOrders]);
      }
      setHasMore(data.userOrders.length > 0);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
    setOrders([]);
  }, [search]);

  const lastOrderRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore]
  );

  return (
    <>
      <TitleCard
        title="Recent Orders"
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons search={search} setSearch={setSearch} />
        }
      >
        <div className="max-w-6xl w-full mx-auto mt-6 relative bg-base-100">
          <div className="w-full mx-auto p-0 md:p-4 lg:p-4 space-y-3">
            {orders.map((order, index) => (
              <div
                ref={index === orders.length - 1 ? lastOrderRef : null}
                key={order._id}
                className="backdrop-blur-[50px] w-full rounded-xl shadow-md border border-base-300 p-6 space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-2 text-base text-base-content">
                  <div>
                    <span className="block text-sm font-medium text-base-content/70">
                      Order ID
                    </span>
                    <span className="text-md font-normal">{order._id}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-base-content/70">
                      Phone
                    </span>
                    <span className="text-lg">{order.phone}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-base-content/70">
                      Address
                    </span>
                    <span className="text-md font-light">{order.address}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-base-content/70">
                      Name
                    </span>
                    <span className="text-lg capitalize">
                      {order.user.username}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-base-content/70">
                      Status
                    </span>
                    <span
                      className={`badge badge-lg ${
                        order.status === "Delivered"
                          ? "badge-success"
                          : "badge-warning"
                      } mt-1`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-base-content/70">
                      Total Paid
                    </span>
                    <span className="text-lg font-semibold">
                      ${order.orderTotal}{" "}
                      <span className="text-sm font-extralight">
                        [{order.paymentWay} payment]
                      </span>
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-base-content mb-3">
                    Items in this Order
                  </h3>
                  <div className="w-full grid grid-cols-3 gap-2">
                    {order?.products?.map((item, idx) => {
                      const product = item.productId;
                      return (
                        <div
                          key={idx}
                          className="bg-base-200 rounded-lg p-2 shadow-lg"
                        >
                          <div className="flex items-center w-full">
                            <img
                              src={product?.image?.url}
                              alt={product?.name}
                              className="w-[5rem] h-[6rem] shadow-md object-cover rounded-lg border"
                            />
                            <div className="ml-6 flex flex-col justify-center items-start gap-1 ">
                              <p className="font-bold text-sm  text-base-content capitalize">
                                {product?.title}
                              </p>
                              <p className="text-sm text-base-content font-extrabold">
                                <span className="text-[0.7rem] font-extralight">
                                  a product by
                                </span>{" "}
                                {product?.company?.name}
                              </p>
                              <p className="text-sm text-base-content/70">
                                <span className="font-bold">Quantity: </span>{" "}
                                {item?.quantity}
                              </p>
                              <p className="text-sm text-base-content/70 font-bold">
                                Price: ${item?.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isFetching && (
              <div className="w-full flex items-center justify-center">
                <span className="loading loading-ring loading-lg"></span>
              </div>
            )}
          </div>
        </div>
      </TitleCard>
    </>
  );
};

export default AdminLayout()(Transactions);
