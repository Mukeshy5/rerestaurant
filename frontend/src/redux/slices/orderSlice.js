import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../utils/api';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (params, { rejectWithValue }) => {
  try {
    const { data } = await orderAPI.getAll(params);
    return data;
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await orderAPI.create(orderData);
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], currentOrder: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => { state.orders = action.payload.data; })
      .addCase(createOrder.fulfilled, (state, action) => { state.currentOrder = action.payload; state.orders.unshift(action.payload); });
  }
});

export default orderSlice.reducer;