import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import userReducer from './features/user/userSlice';
import productReducer from './features/loading/productsSlice';
import api from './features/api';

export const store = configureStore({
  reducer: {
    cartState: cartReducer,
    userState: userReducer,
    productState: productReducer,
    api: api.reducer,
  },
  middleware: (defaultMiddleware) => [...defaultMiddleware(), api.middleware],
});
