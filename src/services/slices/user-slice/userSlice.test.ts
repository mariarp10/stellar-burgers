import { configureStore } from '@reduxjs/toolkit';
import {
  userReducer,
  userInitialState,
  finishAuthCheck,
  userRegister,
  userLogin,
  userLogout,
  getUser,
  updateUser,
  getUserOrders
} from './userSlice';
import type { TUser, TOrder } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  getOrdersApi
} from '@api';
import { setCookie, deleteCookie } from '../../../utils/cookie';

jest.mock('@api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

const mockedRegisterUserApi = registerUserApi as jest.Mock;
const mockedLoginUserApi = loginUserApi as jest.Mock;
const mockedLogoutApi = logoutApi as jest.Mock;
const mockedGetUserApi = getUserApi as jest.Mock;
const mockedUpdateUserApi = updateUserApi as jest.Mock;
const mockedGetOrdersApi = getOrdersApi as jest.Mock;

const mockedSetCookie = setCookie as jest.Mock;
const mockedDeleteCookie = deleteCookie as jest.Mock;

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockOrder: TOrder = {
  _id: 'order-1',
  number: 1010,
  name: 'Тестовый заказ',
  status: 'done',
  ingredients: ['ing-1', 'ing-2'],
  createdAt: '2025-11-01T00:45:00.000Z',
  updatedAt: '2025-11-01T00:47:00.000Z'
};

describe('Слайс User', () => {
  it('finishAuthCheck', () => {
    const stateBefore = { ...userInitialState, checkAuth: false };
    const stateAfter = userReducer(stateBefore, finishAuthCheck());
    expect(stateAfter.checkAuth).toBe(true);
  });
  it('userRegister.pending', () => {
    const stateAfter = userReducer(userInitialState, {
      type: userRegister.pending.type
    });
    expect(stateAfter.isLoading).toBe(true);
  });
  it('userRegister.fulfilled', () => {
    const payload = {
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    };

    const stateAfter = userReducer(
      { ...userInitialState, isLoading: true },
      {
        type: userRegister.fulfilled.type,
        payload
      }
    );

    expect(stateAfter.isLoading).toBe(false);
    expect(stateAfter.data).toEqual(mockUser);
    expect(stateAfter.serverError).toBe('');
    expect(stateAfter.isAuth).toBe(true);

    expect(mockedSetCookie).toHaveBeenCalledWith(
      'accessToken',
      payload.accessToken
    );
    expect(mockedSetCookie).toHaveBeenCalledWith(
      'refreshToken',
      payload.refreshToken
    );
  });
  it('userLogin.rejected', () => {
    const stateAfter = userReducer(
      { ...userInitialState, isLoading: true },
      {
        type: userLogin.rejected.type,
        error: { message: 'Неверный логин или пароль' }
      }
    );

    expect(stateAfter.isLoading).toBe(false);
    expect(stateAfter.serverError).toBe('Неверный логин или пароль');
  });
  it('userLogout.fulfilled', () => {
    const stateBefore = {
      ...userInitialState,
      data: mockUser,
      isAuth: true
    };

    const stateAfter = userReducer(stateBefore, {
      type: userLogout.fulfilled.type
    });

    expect(stateAfter.data).toBeNull();
    expect(stateAfter.isAuth).toBe(false);

    expect(mockedDeleteCookie).toHaveBeenCalledWith('accessToken');
    expect(mockedDeleteCookie).toHaveBeenCalledWith('refreshToken');
  });
  it('getUser.fulfilled', () => {
    const stateAfter = userReducer(
      { ...userInitialState, isLoading: true },
      {
        type: getUser.fulfilled.type,
        payload: { user: mockUser }
      }
    );

    expect(stateAfter.isLoading).toBe(false);
    expect(stateAfter.isAuth).toBe(true);
    expect(stateAfter.checkAuth).toBe(true);
    expect(stateAfter.data).toEqual(mockUser);
  });
  it('updateUser.fulfilled', () => {
    const updatedUser: TUser = { email: 'new@example.com', name: 'New Name' };

    const stateAfter = userReducer(
      { ...userInitialState, data: mockUser, isLoading: true },
      {
        type: updateUser.fulfilled.type,
        payload: { user: updatedUser }
      }
    );

    expect(stateAfter.isLoading).toBe(false);
    expect(stateAfter.data).toEqual(updatedUser);
  });
  it('getUserOrders.fulfilled', () => {
    const stateAfter = userReducer(userInitialState, {
      type: getUserOrders.fulfilled.type,
      payload: [mockOrder]
    });

    expect(stateAfter.orders).toEqual([mockOrder]);
  });
});

describe('user thunks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('userRegister', async () => {
    const payload = {
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    };

    mockedRegisterUserApi.mockResolvedValue(payload);

    const store = configureStore({
      reducer: {
        user: userReducer
      }
    });

    await store.dispatch(
      userRegister({
        email: 'test@example.com',
        password: '1234',
        name: 'Test'
      })
    );

    expect(mockedRegisterUserApi).toHaveBeenCalledTimes(1);

    const state = store.getState().user;

    expect(state.data).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.isLoading).toBe(false);

    expect(mockedSetCookie).toHaveBeenCalledWith(
      'accessToken',
      payload.accessToken
    );
    expect(mockedSetCookie).toHaveBeenCalledWith(
      'refreshToken',
      payload.refreshToken
    );
  });

  it('userLogin', async () => {
    const payload = {
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    };

    mockedLoginUserApi.mockResolvedValue(payload);

    const store = configureStore({
      reducer: {
        user: userReducer
      }
    });

    await store.dispatch(
      userLogin({ email: 'test@example.com', password: '1234' })
    );

    expect(mockedLoginUserApi).toHaveBeenCalledTimes(1);

    const state = store.getState().user;

    expect(state.data).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('userLogout', async () => {
    mockedLogoutApi.mockResolvedValue({ success: true });

    const store = configureStore({
      reducer: {
        user: userReducer
      },
      preloadedState: {
        user: {
          ...userInitialState,
          data: mockUser,
          isAuth: true
        }
      }
    });

    await store.dispatch(userLogout());

    expect(mockedLogoutApi).toHaveBeenCalledTimes(1);

    const state = store.getState().user;

    expect(state.data).toBeNull();
    expect(state.isAuth).toBe(false);
  });

  it('getUserOrders', async () => {
    mockedGetOrdersApi.mockResolvedValue([mockOrder]);

    const store = configureStore({
      reducer: {
        user: userReducer
      }
    });

    await store.dispatch(getUserOrders());

    expect(mockedGetOrdersApi).toHaveBeenCalledTimes(1);

    const state = store.getState().user;

    expect(state.orders).toEqual([mockOrder]);
  });

  it('getUser', async () => {
    mockedGetUserApi.mockResolvedValue({ user: mockUser });

    const store = configureStore({
      reducer: {
        user: userReducer
      }
    });

    await store.dispatch(getUser());

    expect(mockedGetUserApi).toHaveBeenCalledTimes(1);

    const state = store.getState().user;

    expect(state.data).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.checkAuth).toBe(true);
  });
});
