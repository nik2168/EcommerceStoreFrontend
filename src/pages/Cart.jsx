import { useSelector } from "react-redux";
// import { CartItemsList, SectionTitle, CartTotals } from '../components';
import { Link } from "react-router-dom";
import CartItemsList from "../components/CartItemsList";
import CartTotals from "../components/CartTotals";
import SectionTitle from "../components/SectionTitle";

const Cart = () => {
  const user = useSelector((state) => state.userState.user);
  // const {isError, error, data, refetch, isLoading} = useFetchUserCartQuery({token: user?.token});
  // useErrors([{isError, error}])
  const numItemsInCart = useSelector((state) => state.cartState.numItemsInCart);
  const data = useSelector((state) => state.cartState);

  if (numItemsInCart === 0) {
    return <section className="flex items-center justify-center pt-6">
    <SectionTitle text="Your cart is empty" />;
    </section>
  }

  return (
    <>
      <SectionTitle text="Shopping Cart" />
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CartItemsList data={data} />
        </div>
        <div className="lg:col-span-4 lg:pl-4">
          <CartTotals />
          {user ? (
            <Link to="/checkout" className="btn btn-primary btn-block mt-8">
              proceed to checkout
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-block mt-8">
              please login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
export default Cart;
