import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_USA_URL + "/wp-json/wc/v3/";
const consumerKey = import.meta.env.VITE_USA_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_USA_CONSUMER_SECRET;

// Async thunk for fetching products
export const fetchUSAProducts = createAsyncThunk('usa/fetchProducts', async () => {
  const auth = {
    username: consumerKey,
    password: consumerSecret,
  };

  const response = await axios.get(`${apiUrl}products`, {
    params: {
      per_page: 100,
    },
    auth,
  });

  const productsData = response.data;
  const fetchTime = new Date().toISOString();
  localStorage.setItem("usa_products", JSON.stringify(productsData));
  localStorage.setItem("usa_fetchTime", fetchTime);

  return productsData;
});

// Async thunk for fetching orders
export const fetchUSAOrders = createAsyncThunk('usa/fetchOrders', async () => {
  const auth = {
    username: consumerKey,
    password: consumerSecret,
  };

  const response = await axios.get(`${apiUrl}orders`, {
    params: {
      per_page: 100,
    },
    auth,
  });

  const ordersData = response.data;
  const fetchTime = new Date().toISOString();
  localStorage.setItem('usa_orders', JSON.stringify(ordersData));
  localStorage.setItem('usa_ordersFetchTime', fetchTime);

  return ordersData;
});

const usaSlice = createSlice({
  name: 'usa',
  initialState: {
    products: {
      items: [],
      status: 'idle',
      error: null,
    },
    orders: {
      items: [],
      status: 'idle',
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchProducts actions
    builder
      .addCase(fetchUSAProducts.pending, (state) => {
        state.products.status = 'loading';
      })
      .addCase(fetchUSAProducts.fulfilled, (state, action) => {
        state.products.status = 'succeeded';
        state.products.items = action.payload;
      })
      .addCase(fetchUSAProducts.rejected, (state, action) => {
        state.products.status = 'failed';
        state.products.error = action.error.message;
      });

    // Handle fetchOrders actions
    builder
      .addCase(fetchUSAOrders.pending, (state) => {
        state.orders.status = 'loading';
      })
      .addCase(fetchUSAOrders.fulfilled, (state, action) => {
        state.orders.status = 'succeeded';
        state.orders.items = action.payload;
      })
      .addCase(fetchUSAOrders.rejected, (state, action) => {
        state.orders.status = 'failed';
        state.orders.error = action.error.message;
      });
  },
});

export default usaSlice.reducer;
