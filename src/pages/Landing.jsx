import React, { useEffect, useState, lazy, Suspense } from "react";
import Loading from "../components/Loading";
import {
  useFeaturedProductsQuery,
  useFetchRecentSearchQuery,
  useRecommendedProductsQuery,
} from "../features/api";
import { useErrors } from "../hooks/hook";
import {
  FaRobot,
  FaRocket,
  FaBolt,
  FaEye,
  FaBullseye,
  FaCogs,
  FaShoppingCart,
} from "react-icons/fa";

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

// All available icons
const floatingIcons = [
  FaShoppingCart,
  FaRobot,
  FaRocket,
  FaBolt,
  FaEye,
  FaBullseye,
  FaCogs,
];

// Generate one position per icon
const generatePositions = () =>
  floatingIcons.map(() => {
    const positions = ["top", "bottom"];
    const sides = ["left", "right"];
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomPercent = () => `${Math.floor(Math.random() * 90) + 5}%`;

    return {
      [random(positions)]: randomPercent(),
      [random(sides)]: randomPercent(),
      size: 88 + Math.random() * 40,
      rotate: Math.random() * 30 - 15,
    };
  });

const FloatingIcon = ({ Icon, style, scrollY, index }) => {
  const depth = 0.15 + (index % 5) * 0.03;
  const time = Date.now() / 1000;
  const floatOffset = Math.sin(time + index) * 10;
  const translateY = scrollY * depth + floatOffset;

  return (
    <Icon
      className="text-base-200"
      style={{
        position: "absolute",
        color: "teal",
        opacity: 0.9,
        filter: "blur(6px)",
        transform: `translateY(${translateY}px) rotate(${style.rotate}deg)`,
        transition: "transform 0.1s linear",
        ...style,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: -1,
        maxWidth: "100vw", // Prevent overflow
      }}
      size={style.size}
    />
  );
};

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [positions] = useState(generatePositions());

  const { isLoading, data, isError, error } = useFeaturedProductsQuery(true);
  const recentSearch = useFetchRecentSearchQuery();
  const recommendedProducts = useRecommendedProductsQuery();

  useErrors([
    { isError, error },
    { isError: recentSearch?.isError, error: recentSearch?.error },
    {
      isError: recommendedProducts?.isError,
      error: recommendedProducts?.error,
    },
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    const interval = setInterval(() => setScrollY(window.scrollY), 40);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      {floatingIcons.map((Icon, i) => (
        <FloatingIcon
          key={i}
          Icon={Icon}
          style={positions[i]}
          scrollY={scrollY}
          index={i}
        />
      ))}

      <Suspense fallback={<Loading />}>
        <CategoryGrid />
        <Hero productsData={data} />
        <CompaniesGrid />
        <RecommendedProducts
          data={recommendedProducts.data}
          isLoading={recommendedProducts.isLoading}
        />
        <TopSellingProduct productsData={data} />
        <RecentViewed
          data={recentSearch.data}
          isLoading={recentSearch.isLoading}
        />
      </Suspense>
    </>
  );
};

export default Landing;
