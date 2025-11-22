import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { fetchFeed } from './feedSlice';
import { clearIngredients } from './burgerConstructorSlice';

export const sendNewOrder = createAsyncThunk(
  'order/sendNew',
  async (ingredientIds: string[], { dispatch }) => {
    const result = await orderBurgerApi(ingredientIds);
    dispatch(clearIngredients());
    dispatch(fetchFeed());
    return result;
  }
);

type TNewOrderState = {
  name: string;
  orderModalData: TOrder | null;
  isModalOpen: boolean;
  orderRequestSent: boolean;
};

const initialState: TNewOrderState = {
  name: '',
  orderModalData: null,
  isModalOpen: false,
  orderRequestSent: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNewOrder.pending, (state) => {
        state.isModalOpen = true;
        state.orderModalData = null;
        state.orderRequestSent = true;
      })
      .addCase(sendNewOrder.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.orderModalData = action.payload.order;
        state.isModalOpen = true;
        state.orderRequestSent = false;
      })
      .addCase(sendNewOrder.rejected, (state, action) => {
        console.log(action.error.message || 'Не получилось оформить заказ');
        state.isModalOpen = false;
        state.orderRequestSent = false;
      });
  }
});

export const orderReducer = orderSlice.reducer;
export const { closeModal, openModal } = orderSlice.actions;
