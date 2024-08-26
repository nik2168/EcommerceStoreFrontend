import Loading from "./Loading";
import ProductsGrid from "./ProductsGrid";
import SectionTitle from "./SectionTitle";

const FeaturedProducts = ({ data }) => {
const productData = data?.products || [];

  return (
    <div className="pt-24">
      <SectionTitle text="featured products" />
      <ProductsGrid data={productData} />
    </div>
  );
};
export default FeaturedProducts;
