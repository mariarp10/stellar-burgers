import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from '../slices/ingredientsSlice';
import { burgerReducer } from '../slices/burgerConstructorSlice';
import { feedReducer } from '../slices/feedSlice';

export const rootReducer = combineReducers({
  ingredientsArray: ingredientsReducer,
  assembledBurger: burgerReducer,
  feed: feedReducer
});
