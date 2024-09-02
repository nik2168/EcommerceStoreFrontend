import { useSelector } from 'react-redux';
// import { CartItemsList, SectionTitle, CartTotals } from '../components';
import { Link } from 'react-router-dom';
import CartItemsList from '../components/CartItemsList';
import SectionTitle from '../components/SectionTitle';
import CartTotals from '../components/CartTotals';
import { useFetchUserCartQuery } from '../features/api';
import { useErrors } from '../hooks/hook';


const Cart = () => {
  const user = useSelector((state) => state.userState.user);
  const {isError, error, data, refetch, isLoading} = useFetchUserCartQuery({token: user?.token});
  useErrors([{isError, error}])
  console.log("data", data)

  const numItemsInCart = useSelector((state) => state.cartState.numItemsInCart);

  if (numItemsInCart === 0) {
    return <SectionTitle text='Your cart is empty' />;
  }


  return (
    <>
      <SectionTitle text='Shopping Cart' />
      <div className='mt-8 grid gap-8 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <CartItemsList />
        </div>
        <div className='lg:col-span-4 lg:pl-4'>
          <CartTotals />
          {user ? (
            <Link to='/checkout' className='btn btn-primary btn-block mt-8'>
              proceed to checkout
            </Link>
          ) : (
            <Link to='/login' className='btn btn-primary btn-block mt-8'>
              please login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
export default Cart;
