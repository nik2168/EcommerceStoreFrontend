import { useSelector } from 'react-redux';
import CartItem from './CartItem';

const CartItemsList = ({data}) => {
  // const cartItems = useSelector((state) => state.cartState.cartItems);
  const cartData = data?.cartData || [];
  console.log(data?.cartData);
  
  return (
    <>
      {cartData?.map((item) => {
        return <CartItem key={item?._id} cartItem={item?.products} />;
      })}
    </>
  );
};
export default CartItemsList;
