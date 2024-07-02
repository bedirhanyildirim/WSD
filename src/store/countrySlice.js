import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCountry: localStorage.getItem('selectedCountry') || 'orzax-inc',
};

const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
      localStorage.setItem('selectedCountry', action.payload);
    },
  },
});

export const { setSelectedCountry } = countrySlice.actions;
export default countrySlice.reducer;
