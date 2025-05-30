import { useEffect } from "react";
import CategoryGrid from "../components/Categories";
import CompaniesGrid from "../components/Companies";
import FeaturedProducts from "../components/FeaturedProducts";
import Hero from "../components/Hero";
import Loading from "../components/Loading";
import RecentViewed from "../components/RecentViewed";
import RecommendedProducts from "../components/RecommendedProducts";
import TopSellingProduct from "../components/TopSellingProduct";
import { useFeaturedProductsQuery, useFetchRecentSearchQuery, useRecommendedProductsQuery } from "../features/api";
import { useErrors } from "../hooks/hook";

const Landing = () => {
  const { isLoading, data, isError, error, refetch } =
    useFeaturedProductsQuery(true);

    const RecentSearched = useFetchRecentSearchQuery()

  useErrors([{ isError, error }, { isError: RecentSearched?.isError, error: RecentSearched?.error}]);

  useEffect(() => {
   window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return isLoading   ? (
    <Loading />
  ) : (
    <>
      <CategoryGrid />
      <Hero productsData={data} />
      <CompaniesGrid />
      <RecommendedProducts data={RecommendedProducts.data} isLoading={RecommendedProducts.isLoading} />

      <TopSellingProduct productsData={data} />
      <RecentViewed
        data={RecentSearched.data}
        isLoading={RecentSearched.isLoading}
      />
    </>
  );
};
export default Landing;
