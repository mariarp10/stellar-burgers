import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  registerUserApi,
  TRegisterData,
  loginUserApi,
  TLoginData,
  logoutApi,
  getUserApi
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

export const userRegisterThunk = createAsyncThunk(
  'user/register',
  async (newUserData: TRegisterData) => await registerUserApi(newUserData)
);

export const userLoginThunk = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => await loginUserApi(loginData)
);

export const userLogoutThunk = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

export const getUserThunk = createAsyncThunk(
  'user/get',
  async () => await getUserApi()
);

type TUserState = {
  data: TUser | null;
  isLoading: boolean;
  serverError: string;
  isAuth: boolean;
};

const initialState: TUserState = {
  data: null,
  isLoading: false,
  serverError: '',
  isAuth: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // регистрация
    builder
      .addCase(userRegisterThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userRegisterThunk.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isLoading = false;
        state.serverError = '';
        state.isAuth = true;

        setCookie('accessToken', action.payload.accessToken);
        setCookie('refreshToken', action.payload.refreshToken);
      })
      .addCase(userRegisterThunk.rejected, (state, action) => {
        state.serverError = action.error.message
          ? action.error.message
          : 'Произошла ошибка на сервере';
        state.isLoading = false;
      });
    // логин
    builder
      .addCase(userLoginThunk.pending, (state, action) => {
        console.log('отправка запроса на сервер');
        state.isLoading = true;
      })
      .addCase(userLoginThunk.fulfilled, (state, action) => {
        console.log('успешный логин');
        state.data = action.payload.user;
        state.isLoading = false;
        state.serverError = '';
        state.isAuth = true;

        setCookie('accessToken', action.payload.accessToken);
        setCookie('refreshToken', action.payload.refreshToken);
      })
      .addCase(userLoginThunk.rejected, (state, action) => {
        console.log('не получилось залогиниться 😭😭😭');

        state.serverError = action.error.message
          ? action.error.message
          : 'не получилось залогиниться 😭😭😭';
        state.isLoading = false;
      });
    // логаут
    builder.addCase(userLogoutThunk.fulfilled, (state) => {
      state.data = null;
      state.isAuth = false;

      deleteCookie('accessToken');
      deleteCookie('refreshToken');
    });
    // запрос пользователя с сервера
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        console.log('пользователь залогинен');
        state.isAuth = true;
        state.isLoading = false;
        state.data = action.payload.user;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.serverError = action.error.message ? action.error.message : '';
      });
  }
});

export const userReducer = userSlice.reducer;
