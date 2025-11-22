import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

export const userRegister = createAsyncThunk('user/register', registerUserApi);
export const userLogin = createAsyncThunk('user/login', loginUserApi);
export const userLogout = createAsyncThunk('user/logout', logoutApi);
export const getUser = createAsyncThunk('user/get', getUserApi);
export const updateUser = createAsyncThunk('user/update', updateUserApi);

type TUserState = {
  data: TUser | null;
  isLoading: boolean;
  serverError: string;
  isAuth: boolean;
  checkAuth: boolean;
};

const initialState: TUserState = {
  data: null,
  isLoading: false,
  serverError: '',
  isAuth: false,
  checkAuth: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    finishAuthCheck(state) {
      state.checkAuth = true;
    }
  },
  extraReducers: (builder) => {
    // регистрация
    builder
      .addCase(userRegister.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isLoading = false;
        state.serverError = '';
        state.isAuth = true;

        setCookie('accessToken', action.payload.accessToken);
        setCookie('refreshToken', action.payload.refreshToken);
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.serverError = action.error.message
          ? action.error.message
          : 'Произошла ошибка на сервере';
        state.isLoading = false;
      });
    // логин
    builder
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isLoading = false;
        state.serverError = '';
        state.isAuth = true;

        setCookie('accessToken', action.payload.accessToken);
        setCookie('refreshToken', action.payload.refreshToken);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.serverError = action.error.message
          ? action.error.message
          : 'Не получилось выполнить вход';
        state.isLoading = false;
      });
    // логаут
    builder.addCase(userLogout.fulfilled, (state) => {
      state.data = null;
      state.isAuth = false;
      state.checkAuth = false;

      deleteCookie('accessToken');
      deleteCookie('refreshToken');
    });
    // запрос пользователя с сервера
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.isLoading = false;
        state.data = action.payload.user;
        state.checkAuth = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.serverError = action.error.message ? action.error.message : '';
        state.checkAuth = true;
      });
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError =
          action.error.message || 'Не получилось обновить данные';
      });
  }
});

export const { finishAuthCheck } = userSlice.actions;
export const userReducer = userSlice.reducer;
