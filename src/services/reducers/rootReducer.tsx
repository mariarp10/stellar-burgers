import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from '../slices/ingredientsSlice';
import { burgerReducer } from '../slices/burgerConstructorSlice';

export const rootReducer = combineReducers({
  ingredientsArray: ingredientsReducer,
  assembledBurger: burgerReducer
});
