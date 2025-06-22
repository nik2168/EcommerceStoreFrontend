import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../config";

const defaultState = {
  cartItems: [],
  numItemsInCart: 0,
  cartTotal: 0,
  shipping: 500,
  tax: 0,
  orderTotal: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: defaultState,
  reducers: {
    setCart: (state, action) => {
      const products = action.payload;
      let totalPrice = 0;
      products?.map((i) => {
        totalPrice += i.product.price * i.quantity;
      });

      state.cartItems = products?.length > 0 ? products : [];
      state.numItemsInCart = products?.length;
      state.cartTotal = totalPrice;
      state.shipping = 3;
      state.tax = 0;
      state.orderTotal = totalPrice + state.shipping + state.tax;
    },

    addItem: (state, action) => {
      const { product } = action.payload;

      const item = state.cartItems.find((i) => i.cartID === product.cartID);

      if (item) {
        item.amount += product.amount;
      } else {
        state.cartItems.push(product);
      }

      state.numItemsInCart += product.amount;
      state.cartTotal += product.price * product.amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.success("Item added to cart");
    },
    clearCart: (state) => {
      // localStorage.setItem("cart", JSON.stringify(defaultState));
      return defaultState;
    },
    removeItem: (state, action) => {
      const { cartID } = action.payload;
      const product = state.cartItems.find((i) => i.product._id === cartID);
      state.cartItems = state.cartItems.filter((i) => i.product._id !== cartID);
      state.numItemsInCart -= product.amount;
      state.cartTotal -= product.price * product.amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.error("Item removed from cart");
    },
    editItem: (state, action) => {
      const cartID = action.payload._id;
      const amount = action.payload.quantity;
      const item = state.cartItems.find((i) => i.product._id === cartID);
      console.log(state.cartItems);
      state.numItemsInCart += amount - item.amount;
      state.cartTotal += item.price * (amount - item.amount);
      item.amount = amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.success("Cart updated");
    },
    calculateTotals: (state) => {
      state.tax = 0.1 * state.cartTotal;
      state.orderTotal = state.cartTotal + state.shipping + state.tax;
      // localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addItem, clearCart, removeItem, editItem, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;
