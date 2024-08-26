import { createSlice } from "@reduxjs/toolkit";

// const getUserFromLocalStorage = () => {
//   return localStorage.getItem("products");
// };

const initialState = {
  product: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProducts: (state, action) => {
      state.product = action.payload;
      // localStorage.setItem("products", JSON.stringify(action.payload));
    },
    removeProducts: (state, action) => {
      state.product = [];
      // localStorage.removeItem("products");
    },
  },
});

export const { addProducts, removeProducts } = productSlice.actions;

export default productSlice.reducer;
