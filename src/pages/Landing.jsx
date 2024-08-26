import FeaturedProducts from '../components/FeaturedProducts';
import Hero from '../components/Hero';
import Loading from '../components/Loading';
import { useFeaturedProductsQuery } from '../features/api';
import { useErrors } from '../hooks/hook';

const Landing = () => {
      const { isLoading, data, isError, error, refetch } =
        useFeaturedProductsQuery(true);


      useErrors([{ isError, error }]);

      
  return isLoading ? (<Loading/>) :(
    <>
      <Hero />
      <FeaturedProducts data={data}/>
    </>
  );
};
export default Landing;
