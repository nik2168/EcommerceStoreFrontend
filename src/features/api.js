import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "./config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}`,
  }),
  tagTypes: ["Featured", "Products", "Categories", "Companies"],
  endpoints: (builder) => ({
    featuredProducts: builder.query({
      query: (flag) => ({
        url: `/api/v1/product/products?featured=${flag}`,
      }),
      providesTags: ["Featured"],
    }),

    filterProducts: builder.query({
      query: (query) => ({
        url: `/api/v1/product/productsfilter${query}`,
      }),
      keepUnusedDataFor: 0,
    }),

    fetchCategories: builder.query({
      query: () => ({
        url: "/api/v1/category/",
      }),
      providesTags: ["Categories"],
    }),

    fetchCompanies: builder.query({
      query: () => ({
        url: "/api/v1/company/",
      }),
      providesTags: ["Companies"],
    }),
    
  }),
});

export default api;

export const {
  useFeaturedProductsQuery,
  useLazyFilterProductsQuery,
  useFetchCategoriesQuery,
  useFetchCompaniesQuery,
} = api;
