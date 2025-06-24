import ComplexPaginationContainer from "../components/ComplexPaginationContainer";
import OrdersList from "../components/OrdersList";
import SectionTitle from "../components/SectionTitle";

const Orders = () => {
  return (
    <>
      <SectionTitle text="Your Orders" />
      <OrdersList />
      {/* <ComplexPaginationContainer /> */}
    </>
  );
};
export default Orders;
