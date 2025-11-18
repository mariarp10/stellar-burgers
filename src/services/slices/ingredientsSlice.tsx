import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
};

// изначально нет никаких ингрединтов, нужно их получить с сервера
const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false
};

// async thunk-функция для получения ингериентов с сервера
export const fetchIngredients = createAsyncThunk(
  'fetchIngredients',
  async () => {
    const result = getIngredientsApi();
    return result;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      console.log(action.payload);
      state.ingredients = action.payload;
    });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
