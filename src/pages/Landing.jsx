import CategoryGrid from "../components/Categories";
import CompaniesGrid from "../components/Companies";
import Hero from "../components/Hero";
import Loading from "../components/Loading";
import RecentViewed from "../components/RecentViewed";
import RecommendedProducts from "../components/RecommendedProducts";
import TopSellingProduct from "../components/TopSellingProduct";

import { useSelector } from "react-redux";
import {
  useFeaturedProductsQuery,
  useFetchRecentSearchQuery,
  useGetFashionProductsQuery,
  useRecommendedProductsQuery,
} from "../features/api";
import { useErrors } from "../hooks/hook";

const Landing = () => {
  const { user } = useSelector((state) => state.userState);
  const { isLoading, data, isError, error } = useFeaturedProductsQuery(true);

  const recentSearch = user
    ? useFetchRecentSearchQuery()
    : useGetFashionProductsQuery();

  const recommendedProducts = useRecommendedProductsQuery();

  useErrors([
    { isError, error },
    { isError: recentSearch?.isError, error: recentSearch?.error },
    {
      isError: recommendedProducts?.isError,
      error: recommendedProducts?.error,
    },
  ]);

  if (isLoading) return <Loading />;

  return (
    <>
      <CategoryGrid />
      <Hero productsData={data} />
      <CompaniesGrid />
      <RecommendedProducts />
      <TopSellingProduct productsData={data} />
      <RecentViewed
        data={recentSearch.data}
        isLoading={recentSearch.isLoading}
        title={user ? "Recent Search" : "Fashion Products"}
        isScrollable={false}
      />
    </>
  );
};

export default Landing;
