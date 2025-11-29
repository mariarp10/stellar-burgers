import {
  burgerReducer,
  burgerInitialState,
  addBun,
  addIngredient,
  deleteIngredient,
  clearIngredients
} from './burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

const mockBun: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  id: '1',
  name: 'Test bun',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '2',
  name: 'Test main',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

describe('Слайс burgerConstructor', () => {
  it('addBun', () => {
    const stateBefore = burgerInitialState;

    const stateAfter = burgerReducer(stateBefore, addBun(mockBun));

    expect(stateAfter.bun).toEqual(mockBun);
  });
  it('addIngredient', () => {
    const stateBefore = burgerInitialState;

    const stateAfter = burgerReducer(stateBefore, addIngredient(mockMain));

    expect(stateAfter.ingredients).toHaveLength(1);
    expect(stateAfter.ingredients[0]).toEqual(mockMain);
    expect(stateAfter.bun).toBeNull();
  });
  it('deleteIngredient', () => {
    const stateBefore = {
      bun: null,
      ingredients: [mockMain]
    };

    const stateAfter = burgerReducer(
      stateBefore,
      deleteIngredient(mockMain._id)
    );

    expect(stateAfter.ingredients).toHaveLength(0);
  });
  it('deleteIngredient, если передать неверный id', () => {
    const stateBefore = {
      bun: null,
      ingredients: [mockMain]
    };

    const stateAfter = burgerReducer(stateBefore, deleteIngredient('jdjdnnd'));

    expect(stateAfter).toEqual(stateBefore);
  });
  it('clearIngredients', () => {
    const stateBefore = {
      bun: mockBun,
      ingredients: [mockMain]
    };

    const stateAfter = burgerReducer(stateBefore, clearIngredients());

    expect(stateAfter).toEqual(burgerInitialState);
  });
});
