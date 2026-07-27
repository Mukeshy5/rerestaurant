import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/notifications');
    return data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message); }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { notifications: [], unreadCount: 0, loading: false },
  reducers: {
    markAsRead: (state, action) => {
      const notif = state.notifications.find(n => n._id === action.payload);
      if (notif) notif.isRead = true;
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    });
  }
});

export const { markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;