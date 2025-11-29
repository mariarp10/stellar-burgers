import { rootReducer } from './rootReducer';

import { ingredientsInitialState } from '../slices/ingredients-slice/ingredientsSlice';
import { burgerInitialState } from '../slices/burger-constructor-slice/burgerConstructorSlice';
import { feedInitialState } from '../slices/feed-slice/feedSlice';
import { userInitialState } from '../slices/user-slice/userSlice';
import { orderInitialState } from '../slices/order-slice/orderSlice';

describe('rootReducer', () => {
  it('инициализация rootReducer', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toEqual({
      ingredientsArray: ingredientsInitialState,
      assembledBurger: burgerInitialState,
      feed: feedInitialState,
      user: userInitialState,
      order: orderInitialState
    });
  });
});
