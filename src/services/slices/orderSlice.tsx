import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, TNewOrderResponse } from '@api';
import { TOrder } from '@utils-types';
import { fetchFeed } from '../slices/feedSlice';

export const sendNewOrder = createAsyncThunk('order/sendNew', orderBurgerApi);

type TNewOrderState = {
  name: string;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isModalOpen: boolean;
};

const initialState: TNewOrderState = {
  name: '',
  orderRequest: false,
  orderModalData: null,
  isModalOpen: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeModal: (state) => {
      state.isModalOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNewOrder.pending, (state) => {
        state.orderRequest = true;
        state.isModalOpen = true;
      })
      .addCase(sendNewOrder.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(sendNewOrder.rejected, (state, action) => {
        console.log(action.error.message || 'Не получилось оформить заказ');
      });
  }
});

export const orderReducer = orderSlice.reducer;
export const { closeModal } = orderSlice.actions;
