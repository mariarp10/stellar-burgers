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
      state.ingredients = state.ingredients.filter(
        (item) => item._id !== idToDelete
      );
    }
  }
});

export const burgerReducer = burgerConstructorSlice.reducer;
export const { addBun, addIngredient, deleteIngredient } =
  burgerConstructorSlice.actions;
