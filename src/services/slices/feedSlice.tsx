import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { sendNewOrder } from './orderSlice';

export const fetchFeed = createAsyncThunk('fetchFeed', getFeedsApi);

type TFeedState = {
  orders: TOrder[];
  total: number | null;
  totalToday: number | null;
};

const initialState: TFeedState = {
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
      const { orders, total, totalToday } = action.payload;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
    });
  }
});

export const feedReducer = feedSlice.reducer;
// .addCase(sendNewOrder.fulfilled, (state, action) => {
//         const newOrder = action.payload.order;
//         state.orders = [newOrder, ...state.orders];
//       })
