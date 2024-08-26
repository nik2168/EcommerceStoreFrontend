import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import FormCheckbox from "./FormCheckbox";
import FormInput from "./FormInput";
import FormRange from "./FormRange";
import FormSelect from "./FormSelect";
// import { categoryData, companyData } from "../data/data";
import { useDispatch } from "react-redux";
import {
  useFetchCategoriesQuery,
  useFetchCompaniesQuery,
  useLazyFilterProductsQuery,
} from "../features/api";
import { useErrors } from "../hooks/hook";
import { addProducts, removeProducts } from "../features/loading/productsSlice";

const Filters = ({}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const Categories = useFetchCategoriesQuery();
  const Companies = useFetchCompaniesQuery();
  const errors = [
    { error: Categories?.error, isError: Categories?.isError },
    { error: Companies?.error, isError: Companies?.isError },
  ];
  useErrors(errors);
  const categoryData = Categories?.data?.categories?.map((i) => i?.name) || [];
  const companyData = Companies?.data?.companies?.map((i) => i?.name) || [];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [company, setCompany] = useState("all");
  const [order, setOrder] = useState("none");
  const [price, setPrice] = useState("1000000");
  const [shipping, setShipping] = useState(true);
  const [refetch, setRefetch] = useState(true)

  const [fetchFilteredProducts] = useLazyFilterProductsQuery();

  useEffect(() => {
      const query = `?search=${search}&category=${category}&company=${company}&order=${order}&price=${price}&shipping=${shipping}`;
     navigate(query)
    fetchFilteredProducts(query)
      .then(({ data }) => {
        dispatch(addProducts(data?.products))
      })
      .catch((e) => console.log(e));
  }, [refetch])

  return (
    <form className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4  gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
      {/* SEARCH */}
      <FormInput
        type="search"
        label="search product"
        name="search"
        size="input-sm"
        // defaultValue={search}
        value={search}
        setValue={setSearch}
      />
      {/* CATEGORIES */}
      <FormSelect
        label="select category"
        name="category"
        list={categoryData}
        size="select-sm"
        value={category}
        setValue={setCategory}
      />
      {/* COMPANIES */}
      <FormSelect
        label="select company"
        name="company"
        list={companyData}
        size="select-sm"
        value={company}
        setValue={setCompany}
      />
      {/* ORDER */}
      <FormSelect
        label="sort by"
        name="order"
        list={["none", "a-z", "z-a", "high", "low"]}
        size="select-sm"
        value={order}
        setValue={setOrder}
      />
      {/* PRICE */}
      <FormRange
        name="price"
        label="select price"
        size="range-sm"
        value={price}
        setValue={setPrice}
      />
      {/* SHIPPING */}
      <FormCheckbox
        name="shipping"
        label="free shipping"
        size="checkbox-sm"
        value={shipping}
        setValue={setShipping}
        // defaultValue={shipping}
      />
      {/* BUTTONS */}
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          setRefetch(() => setRefetch(!refetch))
        }}
        className="btn btn-primary btn-sm"
      >
        search
      </button>
      <button onClick={(e) => {
        e.preventDefault();
        setSearch('');
        setCategory('all');
        setCompany('all');
        setPrice('1000000');
        setShipping(true);
        setOrder('none');
      }} className="btn btn-accent btn-sm">
        reset
      </button>
    </form>
  );
};
export default Filters;
