
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  useLazyFetchCategoriesQuery,
  useLazyFetchCompaniesQuery,
  useLazyFilterProductsQuery,
} from "../features/api";
import { addProducts } from "../features/loading/productsSlice";
import FormCheckbox from "./FormCheckbox";
import FormInput from "./FormInput";
import FormRange from "./FormRange";
import FormSelect from "./FormSelect";

const Filters = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryString = location.search;

  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    company: searchParams.get("company") || "all",
    order: searchParams.get("order") || "none",
    price: searchParams.get("price") || "1000000",
    shipping: searchParams.get("shipping") || "true",
  });

  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [fetchCategories] = useLazyFetchCategoriesQuery();
  const [fetchCompanies] = useLazyFetchCompaniesQuery();
  const [fetchFilteredProducts] = useLazyFilterProductsQuery();

  // Fetch categories and companies on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, comRes] = await Promise.all([
          fetchCategories(),
          fetchCompanies(),
        ]);
        setCategories(catRes?.data?.categories || []);
        setCompanies(comRes?.data?.companies || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Sync filters to URL
  useEffect(() => {
    setSearchParams({
      search: filters.search,
      category: filters.category?.name || filters.category,
      company: filters.company?.name || filters.company,
      order: filters.order,
      price: filters.price.toString(),
      shipping: filters.shipping.toString(),
    });
  }, [filters]);

  // Fetch products when queryString changes
  useEffect(() => {
    fetchFilteredProducts(queryString)
      .then(({ data }) => {
     
        dispatch(addProducts(data));
      })
      .catch(console.error);
  }, []);

  const handleInputChange = useCallback(
    (field) => (value) => {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // No need to manually trigger refetch; queryString change will auto-trigger it.
    fetchFilteredProducts(queryString)
      .then(({ data }) => {
  
        dispatch(addProducts(data))})

      .catch(console.error);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFilters({
      search: "",
      category: "all",
      company: "all",
      order: "none",
      price: "1000000",
      shipping: true,
    });

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-200 border-2 border-base-300 p-1 rounded-lg  px-8 py-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center"
    >
      <FormInput
        type="search"
        label="search product"
        name="search"
        size="input-sm"
        value={filters.search}
        setValue={handleInputChange("search")}
      />
      <FormSelect
        label="category"
        name="category"
        list={categories}
        size="select-sm"
        value={filters.category}
        setValue={handleInputChange("category")}
      />
      <FormSelect
        label="company"
        name="company"
        list={companies}
        size="select-sm"
        value={filters.company}
        setValue={handleInputChange("company")}
      />
      {/* <FormSelect
        label="sort by"
        name="order"
        list={["none", "a-z", "z-a", "high", "low"]}
        size="select-sm"
        value={filters.order}
        setValue={handleInputChange("order")}
      /> */}
      <FormRange
        name="price"
        label="select price"
        size="range-sm"
        value={filters.price}
        setValue={handleInputChange("price")}
      />
      <FormCheckbox
        name="shipping"
        label="free shipping"
        size="checkbox-sm"
        value={filters.shipping}
        setValue={handleInputChange("shipping")}
      />
      <button type="submit" className="btn btn-primary btn-sm">
        search
      </button>
      <button onClick={handleReset} className="btn btn-accent btn-sm">
        reset
      </button>
    </form>
  );
};

export default Filters;
