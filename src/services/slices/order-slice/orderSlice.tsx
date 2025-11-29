import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { fetchFeed } from '../feed-slice/feedSlice';
import { clearIngredients } from '../burger-constructor-slice/burgerConstructorSlice';

export const sendNewOrder = createAsyncThunk(
  'order/sendNew',
  async (ingredientIds: string[], { dispatch }) => {
    const result = await orderBurgerApi(ingredientIds);
    dispatch(clearIngredients());
    dispatch(fetchFeed());
    return result;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  getOrderByNumberApi
);

type TNewOrderState = {
  name: string;
  orderModalData: TOrder | null;
  isModalOpen: boolean;
  orderRequestSent: boolean;
  orderByNumber: TOrder | null;
};

export const orderInitialState: TNewOrderState = {
  name: '',
  orderModalData: null,
  isModalOpen: false,
  orderRequestSent: false,
  orderByNumber: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState: orderInitialState,
  reducers: {
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
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
    builder
      .addCase(getOrderByNumber.pending, (state, action) => {
        console.log('Запрос на получение данных о заказе отправлен');
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        [state.orderByNumber] = action.payload.orders;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        console.log(
          action.error.message || 'Не удалось получить данные о заказе'
        );
      });
  }
});

export const orderReducer = orderSlice.reducer;
export const { closeModal, openModal, clearOrderByNumber } = orderSlice.actions;
