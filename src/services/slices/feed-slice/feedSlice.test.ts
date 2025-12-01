import { configureStore } from '@reduxjs/toolkit';
import { feedReducer, feedInitialState, fetchFeed } from './feedSlice';
import type { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

const mockedGetFeedsApi = getFeedsApi as jest.Mock;

const mockOrders: TOrder[] = [
  {
    _id: '18909458923034',
    status: 'done',
    name: 'Test order',
    createdAt: '2025-11-01T00:00:00.000Z',
    updatedAt: '2025-11-01T00:01:00.000Z',
    number: 123,
    ingredients: ['bun', 'ingredient 1', 'ingredient 2', 'bun']
  },
  {
    _id: '1898330804808304',
    status: 'done',
    name: 'Test order 2',
    createdAt: '2025-11-01T00:45:00.000Z',
    updatedAt: '2025-11-01T00:47:00.000Z',
    number: 321,
    ingredients: ['bun 2', 'ingredient 3', 'ingredient 4', 'bun 2']
  }
];

const mockFeedResponse = {
  orders: mockOrders,
  total: 120,
  totalToday: 1
};

describe('Слайс Feed', () => {
  it('fetchFeed.pending', () => {
    const stateBefore = feedInitialState;

    const stateAfter = feedReducer(stateBefore, {
      type: fetchFeed.pending.type
    });

    expect(stateAfter.isLoading).toBe(true);
    expect(stateAfter.orders).toEqual([]);
    expect(stateAfter.total).toBeNull();
    expect(stateAfter.totalToday).toBeNull();
  });
  it('fetchFeed.fulfilled', () => {
    const stateBefore = {
      ...feedInitialState,
      isLoading: true
    };

    const stateAfter = feedReducer(stateBefore, {
      type: fetchFeed.fulfilled.type,
      payload: mockFeedResponse
    });

    expect(stateAfter.isLoading).toBe(false);
    expect(stateAfter.orders).toEqual(mockOrders);
    expect(stateAfter.total).toBe(120);
    expect(stateAfter.totalToday).toBe(1);
  });
  it('fetchFeed.rejected', () => {
    const stateBefore = {
      ...feedInitialState,
      isLoading: true
    };

    const stateAfter = feedReducer(stateBefore, {
      type: fetchFeed.rejected.type,
      error: { message: 'Ошибка' }
    });

    expect(stateAfter.isLoading).toBe(false);
    expect(stateAfter.orders).toEqual([]);
    expect(stateAfter.total).toBeNull();
    expect(stateAfter.totalToday).toBeNull();
  });
});

describe('fetchFeed thunk', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Вызов getFeedsApi', async () => {
    mockedGetFeedsApi.mockResolvedValue(mockFeedResponse);

    const store = configureStore({
      reducer: {
        feed: feedReducer
      }
    });

    await store.dispatch(fetchFeed());

    expect(mockedGetFeedsApi).toHaveBeenCalledTimes(1);

    const state = store.getState().feed;

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(120);
    expect(state.totalToday).toBe(1);
  });
});
