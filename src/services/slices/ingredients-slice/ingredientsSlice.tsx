import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { act } from 'react-dom/test-utils';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
};

export const ingredientsInitialState: TIngredientsState = {
  ingredients: [],
  isLoading: false
};

export const fetchIngredients = createAsyncThunk(
  'fetchIngredients',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: ingredientsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        console.log(
          action.error.message || 'Не удалось загрузить список ингредиентов'
        );
        state.isLoading = false;
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
