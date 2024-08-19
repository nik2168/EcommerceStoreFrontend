import Loading from "./Loading";
import ProductsGrid from "./ProductsGrid";
import SectionTitle from "./SectionTitle";

const FeaturedProducts = ({ data }) => {

  return (
    <div className="pt-24">
      <SectionTitle text="featured products" />
      <ProductsGrid data={data}  />
    </div>
  );
};
export default FeaturedProducts;
