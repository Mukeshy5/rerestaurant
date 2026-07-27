import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../utils/api';

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await productAPI.getFeatured();
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const fetchTrendingProducts = createAsyncThunk('products/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await productAPI.getTrending();
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { featured: [], trending: [], flashSale: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => { state.featured = action.payload; })
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => { state.trending = action.payload; });
  }
});

export default productSlice.reducer;