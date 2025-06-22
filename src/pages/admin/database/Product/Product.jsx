import moment from "moment";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../../features/adminHeader/headerSlice.js";
import AdminLayout from "../../AdminLayout/AdminLayout.jsx";
import TitleCard from "../../components/Cards/TitleCard.jsx";
import SearchBar from "../../components/Input/SearchBar.jsx";
import { useLazyAdminFilterProductsQuery } from "../../../../features/api.js";
import { useNavigate } from "react-router-dom";

const TopSideButtons = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Product" }));
  }, []);

  return (
    <div className="inline-block float-right">
      <SearchBar
        searchText={search}
        placeholderText={"search by name ..."}
        styleClass="mr-4"
        setSearchText={setSearch}
      />
      <button
        className="btn btn-outline btn-primary btn-sm z-10"
        onClick={() => navigate(`/admin/product/add`)}
      >
        Add Product
      </button>
    </div>
  );
};

const Product = () => {
  const [productsData, setProductsData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const observer = useRef();
  const navigate = useNavigate();

  const [fetchFilteredProducts] = useLazyAdminFilterProductsQuery();

  const loadProducts = useCallback(
    async (pageToLoad = 1, reset = false) => {
      const query = `?search=${search}&category=all&company=all&order=none&price=1000000000&page=${pageToLoad}`;
      try {
        const response = await fetchFilteredProducts(query).unwrap();
        const fetched = response?.products || [];

        if (reset) {
          setProductsData(fetched);
        } else {
          setProductsData((prev) => [...prev, ...fetched]);
        }

        setHasMore(fetched.length > 0);
      } catch (err) {
        console.error("Error fetching products", err);
        setHasMore(false);
      }
    },
    [fetchFilteredProducts, search]
  );

  useEffect(() => {
    setPage(1);
    loadProducts(1, true);
  }, [search]);

  useEffect(() => {
    if (page > 1) loadProducts(page);
  }, [page]);

  const lastItemRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <>
      <TitleCard
        title="Recent Products"
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons search={search} setSearch={setSearch} />
        }
      >
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Category</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((product, index) => {
                const isLast = index === productsData.length - 1;

                return (
                  <tr key={product._id} ref={isLast ? lastItemRef : null}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={product.image.url} alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{product.title}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.company.name}</td>
                    <td>{product.category.name}</td>
                    <td>${product.price}</td>
                    <td>
                      <button
                        className="btn btn-xs btn-outline btn-primary"
                        onClick={() =>
                          navigate(`/admin/product/${product._id}`)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!hasMore && productsData.length > 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-sm py-4 text-gray-400"
                  >
                    No more products to load.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
};

export default AdminLayout()(Product);
