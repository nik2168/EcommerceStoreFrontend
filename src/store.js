import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import userReducer from './features/user/userSlice';
import loadingReducer from './features/loading/loadingSlice';
import api from './features/api';

export const store = configureStore({
  reducer: {
    cartState: cartReducer,
    userState: userReducer,
    loadingState: loadingReducer,
    api: api.reducer,
  },
  middleware: (defaultMiddleware) => [...defaultMiddleware(), api.middleware],
});
