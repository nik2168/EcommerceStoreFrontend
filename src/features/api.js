import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { server } from "./config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}`,
  }),
  tagTypes: ["Featured"],
  endpoints: (builder) => ({
    featuredProducts: builder.query({
      query: (flag) => ({
        url: `/api/v1/product/products?featured=${flag}`,
      }),
      providesTags: ["Featured"],
    }),
  }),
});

export default api;

export const {
useFeaturedProductsQuery,
} = api;
