import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from '../slices/ingredients-slice/ingredientsSlice';
import { burgerReducer } from '../slices/burger-constructor-slice/burgerConstructorSlice';
import { feedReducer } from '../slices/feed-slice/feedSlice';
import { userReducer } from '../slices/user-slice/userSlice';
import { orderReducer } from '../slices/order-slice/orderSlice';

export const rootReducer = combineReducers({
  ingredientsArray: ingredientsReducer,
  assembledBurger: burgerReducer,
  feed: feedReducer,
  user: userReducer,
  order: orderReducer
});
