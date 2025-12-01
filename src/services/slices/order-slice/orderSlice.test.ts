import { configureStore } from '@reduxjs/toolkit';
import {
  orderReducer,
  orderInitialState,
  closeModal,
  openModal,
  clearOrderByNumber,
  sendNewOrder,
  getOrderByNumber
} from './orderSlice';
import type { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi } from '@api';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  getFeedsApi: jest.fn()
}));

const mockedOrderBurgerApi = orderBurgerApi as jest.Mock;
const mockedGetOrderByNumberApi = getOrderByNumberApi as jest.Mock;

const mockOrder: TOrder = {
  _id: 'order-1',
  number: 12345,
  name: 'Тестовый заказ',
  status: 'done',
  ingredients: ['ing-1', 'ing-2'],
  createdAt: '2025-11-01T00:45:00.000Z',
  updatedAt: '2023-11-01T00:46:00.000Z'
};

describe('Слайс Order', () => {
  it('openModal', () => {
    const stateBefore = { ...orderInitialState, isModalOpen: false };

    const stateAfter = orderReducer(stateBefore, openModal());

    expect(stateAfter.isModalOpen).toBe(true);
  });
  it('closeModal', () => {
    const stateBefore = { ...orderInitialState, isModalOpen: true };

    const stateAfter = orderReducer(stateBefore, closeModal());

    expect(stateAfter.isModalOpen).toBe(false);
  });
  it('clearOrderByNumber', () => {
    const stateBefore = {
      ...orderInitialState,
      orderByNumber: mockOrder
    };

    const stateAfter = orderReducer(stateBefore, clearOrderByNumber());

    expect(stateAfter.orderByNumber).toBeNull();
  });
  it('sendNewOrder.pending', () => {
    const stateBefore = orderInitialState;

    const stateAfter = orderReducer(stateBefore, {
      type: sendNewOrder.pending.type
    });

    expect(stateAfter.isModalOpen).toBe(true);
    expect(stateAfter.orderModalData).toBeNull();
    expect(stateAfter.orderRequestSent).toBe(true);
  });
  it('sendNewOrder.fulfilled', () => {
    const stateBefore = {
      ...orderInitialState,
      orderRequestSent: true
    };

    const payload = {
      name: 'Тестовый заказ',
      order: mockOrder
    };

    const stateAfter = orderReducer(stateBefore, {
      type: sendNewOrder.fulfilled.type,
      payload
    });

    expect(stateAfter.name).toBe(payload.name);
    expect(stateAfter.orderModalData).toEqual(mockOrder);
    expect(stateAfter.isModalOpen).toBe(true);
    expect(stateAfter.orderRequestSent).toBe(false);
  });
  it('sendNewOrder.rejected', () => {
    const stateBefore = {
      ...orderInitialState,
      isModalOpen: true,
      orderRequestSent: true
    };

    const stateAfter = orderReducer(stateBefore, {
      type: sendNewOrder.rejected.type,
      error: { message: 'Ошибка' }
    });

    expect(stateAfter.isModalOpen).toBe(false);
    expect(stateAfter.orderRequestSent).toBe(false);
  });
  it('getOrderByNumber.fulfilled', () => {
    const stateBefore = orderInitialState;

    const stateAfter = orderReducer(stateBefore, {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: [mockOrder] }
    });

    expect(stateAfter.orderByNumber).toEqual(mockOrder);
  });
});

describe('order thunks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('sendNewOrder', async () => {
    const mockResponse = {
      name: 'Тестовый заказ',
      order: mockOrder
    };

    mockedOrderBurgerApi.mockResolvedValue(mockResponse);

    const store = configureStore({
      reducer: {
        order: orderReducer
      }
    });

    const ingredientIds = ['ing-1', 'ing-2'];

    await store.dispatch(sendNewOrder(ingredientIds));

    expect(mockedOrderBurgerApi).toHaveBeenCalledTimes(1);
    expect(mockedOrderBurgerApi).toHaveBeenCalledWith(ingredientIds);

    const state = store.getState().order;

    expect(state.name).toBe(mockResponse.name);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.isModalOpen).toBe(true);
    expect(state.orderRequestSent).toBe(false);
  });
  it('getOrderByNumber', async () => {
    mockedGetOrderByNumberApi.mockResolvedValue({
      orders: [mockOrder]
    });
    const store = configureStore({
      reducer: {
        order: orderReducer
      }
    });
    const orderNumber = 12345;
    await store.dispatch(getOrderByNumber(orderNumber));
    expect(mockedGetOrderByNumberApi).toHaveBeenCalledTimes(1);
    expect(mockedGetOrderByNumberApi).toHaveBeenCalledWith(
      orderNumber,
      expect.anything()
    );
    const state = store.getState().order;
    expect(state.orderByNumber).toEqual(mockOrder);
  });
});
