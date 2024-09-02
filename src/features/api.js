import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "./config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}`,
  }),
  tagTypes: ["Featured", "Products", "Categories", "Companies", "Cart", "SingleProduct"],
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

    getSingleProduct: builder.query({
      query: (query) => ({
        url: `/api/v1/product/${query}`,
      }),
      providesTags: ["SingleProduct"]
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

    fetchUserCart: builder.query({
      query: (data) => ({
        url: "/api/v1/cart/",
        method: "POST",
        credentials: "include",
        body: data
      }),
      providesTags: ["Cart"]
    })
    
  }),
});

export default api;

export const {
  useFeaturedProductsQuery,
  useLazyFilterProductsQuery,
  useGetSingleProductQuery,
  useFetchCategoriesQuery,
  useFetchCompaniesQuery,
  useFetchUserCartQuery,
} = api;
