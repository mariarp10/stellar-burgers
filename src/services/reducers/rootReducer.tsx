import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from '../slices/ingredientsSlice';
import { burgerReducer } from '../slices/burgerConstructorSlice';
import { feedReducer } from '../slices/feedSlice';
import { userReducer } from '../slices/userSlice';
import { orderReducer } from '../slices/orderSlice';

export const rootReducer = combineReducers({
  ingredientsArray: ingredientsReducer,
  assembledBurger: burgerReducer,
  feed: feedReducer,
  user: userReducer,
  order: orderReducer
});
