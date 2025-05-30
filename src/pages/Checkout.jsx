import { useSelector } from 'react-redux';
// import { CheckoutForm, SectionTitle, CartTotals } from '../components';
import { toast } from 'react-toastify';
import { redirect } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import SectionTitle from '../components/SectionTitle';
import CartTotals from '../components/CartTotals';

export const loader = (store) => () => {
  const user = store.getState().userState.user;

  if (!user) {
    toast.warn('You must be logged in to checkout');
    return redirect('/login');
  }
  return null;
};

const Checkout = () => {

  const cartTotal = useSelector((state) => state.cartState.cartTotal);
  if (cartTotal === 0) {
return <section className="flex items-center justify-center pt-6">
  <SectionTitle text="Your cart is empty" />;
</section>;  }
  return (
    <>
      <SectionTitle text='place your order' />
      <div className='mt-8 grid gap-8 md:grid-cols-2 items-start'>
        <CheckoutForm />
        <CartTotals />
      </div>
    </>
  );
};
export default Checkout;
