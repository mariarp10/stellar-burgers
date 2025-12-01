import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { sendNewOrder } from '../order-slice/orderSlice';

export const fetchFeed = createAsyncThunk('fetchFeed', getFeedsApi);

type TFeedState = {
  orders: TOrder[];
  total: number | null;
  totalToday: number | null;
  isLoading: boolean;
};

export const feedInitialState: TFeedState = {
  orders: [],
  total: null,
  totalToday: null,
  isLoading: false
};

const feedSlice = createSlice({
  name: 'feed',
  initialState: feedInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const { orders, total, totalToday } = action.payload;
        state.orders = orders;
        state.total = total;
        state.totalToday = totalToday;
        state.isLoading = false;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        console.log(
          action.error.message ||
            'Не удалось загрузить данные для страницы /feed'
        );
        state.isLoading = false;
      });
  }
});

export const feedReducer = feedSlice.reducer;
