import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "./config";
import { use } from "react";
import { buildQueries } from "@testing-library/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}`,
  }),
  tagTypes: [
    "Featured",
    "Products",
    "Categories",
    "Companies",
    "Cart",
    "SingleProduct",
    "Orders",
    "Product",
    "RecentSearch",
  ],
  endpoints: (builder) => ({
    featuredProducts: builder.query({
      query: (flag) => ({
        url: `/api/v1/product/products?featured=${flag}`,
        credentials: "include",
      }),
      providesTags: ["Featured"],
    }),

    filterProducts: builder.query({
      query: (query) => ({
        url: `/api/v1/product/productsfilter${query}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    adminFilterProducts: builder.query({
      query: (query) => ({
        url: `/api/v1/admin/productsfilter${query}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    fetchCategories: builder.query({
      query: () => ({
        url: "/api/v1/category/",
        credentials: "include",
      }),
      providesTags: ["Categories"],
    }),

    fetchCompanies: builder.query({
      query: () => ({
        url: "/api/v1/company/",
        credentials: "include",
      }),
      providesTags: ["Companies"],
    }),
    fetchUserCart: builder.query({
      query: (data) => ({
        url: "/api/v1/cart/",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      providesTags: ["Cart"],
    }),

    singleProduct: builder.query({
      query: (productId) => ({
        url: `/api/v1/product/getsingleproduct/${productId}`,
      }),
      provideTags: ["Product", "RecentSearch"],
    }),

    updateUserCart: builder.mutation({
      query: (data) => ({
        url: "/api/v1/cart/updateitems",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation({
      query: ({ id }) => ({
        url: `/api/v1/cart/removeitem/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),

    createNewOrder: builder.mutation({
      query: (body) => ({
        url: `/api/v1/order/create`,
        method: "POST",
        credentials: "include",
        body,
      }),
      invalidatesTags: ["Orders", "Cart", "RecentSearch"],
    }),

    getUserOrders: builder.query({
      query: () => ({
        url: `/api/v1/order/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Orders"],
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: `/api/v1/user/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),

    updateProduct: builder.mutation({
      query: (formdata) => ({
        url: `/api/v1/admin/update/product/${formdata.get("productId")}`,
        method: "PUT",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["Product", "Products"],
    }),

    addProduct: builder.mutation({
      query: (formdata) => ({
        url: `/api/v1/admin/product/add`,
        method: "POST",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["Products"],
    }),

    singleProductAdmin: builder.query({
      query: (productId) => ({
        url: `/api/v1/admin/product/${productId}`,
        credentials: "include",
      }),
      providesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/api/v1/admin/product/delete/${productId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    fetchFilterCompanies: builder.query({
      query: (search) => ({
        url: `/api/v1/admin/companies?search=${search}`,
        credentials: "include",
      }),
      providesTags: ["Companies"],
    }),

    addCompany: builder.mutation({
      query: (formdata) => ({
        url: `/api/v1/admin/company/add`,
        method: "POST",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["Companies"],
    }),

    deleteCompany: builder.mutation({
      query: (companyId) => ({
        url: `/api/v1/admin/company/remove/${companyId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Companies"],
    }),

    updateCompany: builder.mutation({
      query: (formdata) => ({
        url: `/api/v1/admin/company/update/${formdata.get("companyId")}`,
        method: "PUT",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["Companies"],
    }),

    fetchSingleCompany: builder.query({
      query: (companyId) => ({
        url: `/api/v1/admin/company/data/${companyId}`,
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    fetchFilteredCategories: builder.query({
      query: (search) => ({
        url: `/api/v1/admin/categories?search=${search}`,
        credentials: "include",
      }),
      providesTags: ["Categories"],
    }),

    addCategory: builder.mutation({
      query: (formdata) => ({
        url: `/api/v1/admin/category/add`,
        method: "POST",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/api/v1/admin/category/remove/${categoryId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation({
      query: (formdata) => ({
        url: `/api/v1/admin/category/update/${formdata.get("categoryId")}`,
        method: "PUT",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["Categories"],
    }),

    fetchSingleCategory: builder.query({
      query: (categoryId) => ({
        url: `/api/v1/admin/category/data/${categoryId}`,
        credentials: "include",
      }),
    }),

    fetchAdminStats: builder.query({
      query: () => ({
        url: "/api/v1/admin/stats/data",
        credentials: "include",
      }),
    }),

    rateProductOrder: builder.mutation({
      query: (body) => ({
        url: `/api/v1/order/rating`,
        method: "PUT",
        credentials: "include",
        body: body,
      }),
      invalidatesTags: ["Orders"],
    }),

    updateUserInteractions: builder.mutation({
      query: (body) => ({
        url: `/api/v1/user/interactions/update`,
        method: "PUT",
        credentials: "include",
        body: body,
      }),
      invalidatesTags: [],
    }),

    fetchRecentSearch: builder.query({
      query: () => ({
        url: `/api/v1/user/recent/search`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["RecentSearch"],
    }),

    recommendedProducts: builder.query({
      query: (id) => ({
        url: `/api/v1/product/recommendations`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Recommended"],
    }),

    adminOrdersData: builder.query({
      query: () => ({
        url: "api/v1/admin/orders/data",
        method: "GET",
        credentials: "include",
      }),
    }),

    topSellingProductsUser: builder.query({
      query: () => ({
        url: "api/v1/product/topselling/products",
        method: "GET",
        credentials: "include",
      }),
    }),

    updateUserPreferences: builder.mutation({
      query: (body) => ({
        url: "api/v1/user/update/preference",
        method: "PUT",
        credentials: "include",
        body: body,
      }),
    }),

    getSingleProductRecommendation: builder.mutation({
      query: (body) => ({
        url: "api/v1/product/single/recommendation",
        method: "PUT",
        credentials: "include",
        body: body,
      }),
    }),

    getTopRatingProduct: builder.query({
      query: () => ({
        url: "api/v1/product/toprating/products",
        method: "GET",
        credentials: "include",
      }),
    }),

    getFashionProducts: builder.query({
      query: () => ({
        url: "api/v1/product/fashion/products",
        method: "GET",
        credentials: "include",
      }),
    })

  }),
});

export default api;

export const {
  useFeaturedProductsQuery,
  useLazyFilterProductsQuery,
  useLazyAdminFilterProductsQuery,
  useFetchCategoriesQuery,
  useFetchCompaniesQuery,
  useLazyFetchCategoriesQuery,
  useLazyFetchCompaniesQuery,
  useFetchUserCartQuery,
  useSingleProductQuery,
  useUpdateUserCartMutation,
  useRemoveCartItemMutation,
  useCreateNewOrderMutation,
  useGetUserOrdersQuery,
  useLogoutUserMutation,
  useUpdateProductMutation,
  useLazySingleProductQuery,
  useAddProductMutation,
  useLazySingleProductAdminQuery,
  useDeleteProductMutation,
  useLazyFetchFilterCompaniesQuery,
  useLazyFetchSingleCompanyQuery,
  useDeleteCompanyMutation,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useLazyFetchFilteredCategoriesQuery,
  useLazyFetchSingleCategoryQuery,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useFetchAdminStatsQuery,
  useRateProductOrderMutation,
  useUpdateUserInteractionsMutation,
  useFetchRecentSearchQuery,
  useRecommendedProductsQuery,
  useAdminOrdersDataQuery,
  useTopSellingProductsUserQuery,
  useUpdateUserPreferencesMutation,
  useLazyFetchUserCartQuery,
  useGetSingleProductRecommendationMutation,
  useGetTopRatingProductQuery,
  useGetFashionProductsQuery
} = api;
