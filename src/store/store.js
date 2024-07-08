import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import ordersReducer from './ordersSlice';
import countryReducer from './countrySlice';
import usaReducer from './usaSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    orders: ordersReducer,
    country: countryReducer,
    usa: usaReducer
  },
});
