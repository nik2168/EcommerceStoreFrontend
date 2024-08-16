import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import userReducer from './features/user/userSlice';
import api from './features/api';

export const store = configureStore({
  reducer: {
    cartState: cartReducer,
    userState: userReducer,
    api: api.reducer,
  },
  middleware: (defaultMiddleware) => [...defaultMiddleware(), api.middleware],
});
