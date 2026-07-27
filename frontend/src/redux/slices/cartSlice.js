
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api', withCredentials: true });

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/cart', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (item, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/cart/add', item, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, quantity, variant }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/cart/update/${productId}`, { quantity, variant }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ productId, variant }, { rejectWithValue }) => {
  try {
    const { data } = await API.delete(`/cart/remove/${productId}?variant=${JSON.stringify(variant)}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0, itemCount: 0, loading: false, error: null },
  reducers: { clearCart: (state) => { state.items = []; state.total = 0; state.itemCount = 0; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => { state.items = action.payload.items; state.total = action.payload.total; state.itemCount = action.payload.itemCount; })
      .addCase(addToCart.fulfilled, (state, action) => { state.items = action.payload.items; state.total = action.payload.total; state.itemCount = action.payload.itemCount; })
      .addCase(updateCartItem.fulfilled, (state, action) => { state.items = action.payload.items; state.total = action.payload.total; state.itemCount = action.payload.itemCount; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.items = action.payload.items; state.total = action.payload.total; state.itemCount = action.payload.itemCount; });
  }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;