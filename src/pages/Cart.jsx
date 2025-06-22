import { useSelector } from "react-redux";
// import { CartItemsList, SectionTitle, CartTotals } from '../components';
import { Link } from "react-router-dom";
import CartItemsList from "../components/CartItemsList";
import CartTotals from "../components/CartTotals";
import SectionTitle from "../components/SectionTitle";
import { useEffect } from "react";

const Cart = () => {
  const user = useSelector((state) => state.userState.user);

  const numItemsInCart = useSelector((state) => state.cartState.numItemsInCart);
  const data = useSelector((state) => state.cartState);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (numItemsInCart === 0) {
    return (
      <section className="flex items-center justify-center pt-6">
        <SectionTitle text="Your cart is empty" />;
      </section>
    );
  }

  return (
    <>
      <SectionTitle text="Shopping Cart " />
      <div className="mt-8 grid gap-8 lg:grid-cols-12 backdrop-blur-[50px] p-3 border-2 shadow-lg border-base-200">
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
