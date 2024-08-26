import { useState } from "react";
import Filters from "../components/Filters";
import PaginationContainer from "../components/PaginationContainer";
import ProductsContainer from "../components/ProductsContainer";
import { useParams, useSearchParams } from "react-router-dom";

const Products = () => {
  return (
    <>
      <Filters />
      <ProductsContainer />
      {/* <PaginationContainer /> */}
    </>
  );
};
export default Products;
