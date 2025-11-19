import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

export const fetchFeed = createAsyncThunk(
  'fetchFeed',
  async () => await getFeedsApi()
);

type TFeedState = {
  success: boolean;
  orders: TOrder[];
  total: number | null;
  totalToday: number | null;
};

const initialState: TFeedState = {
  success: false,
  orders: [],
  total: null,
  totalToday: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeed.fulfilled, (state, action) => {
      const { success, orders, total, totalToday } = action.payload;
      state.success = success;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
    });
  }
});

export const feedReducer = feedSlice.reducer;
