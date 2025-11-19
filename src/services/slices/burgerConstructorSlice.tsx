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
    },
    deleteIngredient(state, action) {
      const idToDelete = action.payload;

      const index = state.ingredients.findIndex(
        (item) => item._id === idToDelete
      );

      if (index !== -1) {
        state.ingredients.splice(index, 1);
      }
    },
    clearIngredients(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const burgerReducer = burgerConstructorSlice.reducer;
export const { addBun, addIngredient, deleteIngredient, clearIngredients } =
  burgerConstructorSlice.actions;
