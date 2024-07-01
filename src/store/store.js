import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import ordersReducer from './ordersSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    orders: ordersReducer,
  },
});
