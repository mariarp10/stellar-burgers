import { createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action) {
      state.bun = action.payload;
    },
    addIngredient(state, action) {
      state.ingredients.push(action.payload);
    }
  }
});

export const burgerReducer = burgerConstructorSlice.reducer;
export const { addBun, addIngredient } = burgerConstructorSlice.actions;
