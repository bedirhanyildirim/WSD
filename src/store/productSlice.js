import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_URL + "/wp-json/wc/v3/products";
const consumerKey = import.meta.env.VITE_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_CONSUMER_SECRET;

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (selectedCompany) => {
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

  const productsData = response.data;
  const fetchTime = new Date().toISOString();
  localStorage.setItem(`${selectedCompany}_products`, JSON.stringify(productsData));
  localStorage.setItem(`${selectedCompany}_fetchTime`, fetchTime);

  return productsData;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
