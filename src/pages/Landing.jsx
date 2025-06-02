import { lazy, Suspense } from "react";
import Loading from "../components/Loading";
import {
  useFeaturedProductsQuery,
  useFetchRecentSearchQuery,
  useGetFashionProductsQuery,
  useGetTopRatingProductQuery,
  useRecommendedProductsQuery,
} from "../features/api";
import { useErrors } from "../hooks/hook";
import { useSelector } from "react-redux";

// Lazy-loaded components
const CategoryGrid = lazy(() => import("../components/Categories"));
const CompaniesGrid = lazy(() => import("../components/Companies"));
const FeaturedProducts = lazy(() => import("../components/FeaturedProducts"));
const Hero = lazy(() => import("../components/Hero"));
const RecentViewed = lazy(() => import("../components/RecentViewed"));
const RecommendedProducts = lazy(() =>
  import("../components/RecommendedProducts")
);
const TopSellingProduct = lazy(() => import("../components/TopSellingProduct"));

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
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </>
  );
};

export default Landing;
