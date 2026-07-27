import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api', withCredentials: true });

export const login = createAsyncThunk('auth/login', async ({ email, phone, password, loginType }, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/login', { email, phone, password, loginType });
    localStorage.setItem('token', data.data.token);
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message || 'Login failed'); }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/register', userData);
    localStorage.setItem('token', data.data.token);
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message || 'Registration failed'); }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/auth/profile', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('token'), isAuthenticated: false, loading: false, error: null },
  reducers: {
    logout: (state) => { state.user = null; state.token = null; state.isAuthenticated = false; localStorage.removeItem('token'); },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(getProfile.fulfilled, (state, action) => { state.user = action.payload; state.isAuthenticated = true; })
      .addCase(getProfile.rejected, (state) => { state.user = null; state.isAuthenticated = false; state.token = null; localStorage.removeItem('token'); });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;