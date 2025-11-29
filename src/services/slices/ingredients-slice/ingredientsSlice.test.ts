import { configureStore } from '@reduxjs/toolkit';
import {
  ingredientsReducer,
  ingredientsInitialState,
  fetchIngredients
} from './ingredientsSlice';
import type { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const mockedGetIngredientsApi = getIngredientsApi as jest.Mock;

const mockIngredients: TIngredient[] = [
  {
    _id: '8475707883094830',
    name: 'Test ingredient 1',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 150,
    price: 100,
    image: 'https://example.com/ing1.png',
    image_mobile: 'https://example.com/ing1-mobile.png',
    image_large: 'https://example.com/ing1-large.png'
  },
  {
    _id: '09388784858094893',
    name: 'Test ingredient 2',
    type: 'sauce',
    proteins: 2,
    fat: 1,
    carbohydrates: 5,
    calories: 50,
    price: 30,
    image: 'https://example.com/ing2.png',
    image_mobile: 'https://example.com/ing2-mobile.png',
    image_large: 'https://example.com/ing2-large.png'
  }
];

describe('Слайс Ingredients', () => {
  it('fetchIngredients.pending', () => {
    const stateBefore = ingredientsInitialState;

    const stateAfter = ingredientsReducer(stateBefore, {
      type: fetchIngredients.pending.type
    });

    expect(stateAfter.isLoading).toBe(true);
    expect(stateAfter.ingredients).toEqual([]);
  });

  it('fetchIngredients.fulfilled', () => {
    const stateBefore = {
      ...ingredientsInitialState,
      isLoading: true
    };

    const stateAfter = ingredientsReducer(stateBefore, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    expect(stateAfter.isLoading).toBe(false);
    expect(stateAfter.ingredients).toEqual(mockIngredients);
  });

  it('fetchIngredients.rejected', () => {
    const stateBefore = {
      ...ingredientsInitialState,
      isLoading: true,
      ingredients: mockIngredients
    };

    const stateAfter = ingredientsReducer(stateBefore, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка' }
    });

    expect(stateAfter.isLoading).toBe(false);
    expect(stateAfter.ingredients).toEqual(mockIngredients);
  });
});

describe('fetchIngredients thunk', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('вызов getIngredientsApi', async () => {
    mockedGetIngredientsApi.mockResolvedValue(mockIngredients);

    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer
      }
    });

    await store.dispatch(fetchIngredients() as any);

    expect(mockedGetIngredientsApi).toHaveBeenCalledTimes(1);

    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });
});
