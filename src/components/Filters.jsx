import { Link } from "react-router-dom";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormRange from "./FormRange";
import FormCheckbox from "./FormCheckbox";
import { useState } from "react";
import { categoryData, companyData } from "../data/data";

const Filters = () => {
  //   const { meta, params } = useLoaderData();
  //   const { search, company, category, shipping, order, price } = params;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [order, setOrder] = useState("");
  const [price, setPrice] = useState('100000');
  const [shipping, setShipping] = useState(false);
  // console.log(shipping);
  

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
      <button type="submit" className="btn btn-primary btn-sm">
        search
      </button>
      <Link to="/products" className="btn btn-accent btn-sm">
        reset
      </Link>
    </form>
  );
};
export default Filters;
