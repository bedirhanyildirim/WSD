import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_URL + "/wp-json/wc/v3/orders";
const consumerKey = import.meta.env.VITE_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_CONSUMER_SECRET;

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const auth = {
    username: consumerKey,
    password: consumerSecret,
  };

  const response = await axios.get(apiUrl, {
    params: {
      per_page: 100,
    },
    auth,
  });

  const ordersData = response.data;
  const fetchTime = new Date().toISOString();
  localStorage.setItem('orders', JSON.stringify(ordersData));
  localStorage.setItem('ordersFetchTime', fetchTime);

  return ordersData;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ordersSlice.reducer;