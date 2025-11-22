import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { sendNewOrder, closeModal } from '../../services/slices/orderSlice';
import { useDispatch } from '../../services/store';
import { clearIngredients } from '../../services/slices/burgerConstructorSlice';
import { fetchFeed } from '../../services/slices/feedSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.assembledBurger
  );

  const { isAuth } = useSelector((state: RootState) => state.user);

  const { orderRequest, orderModalData, isModalOpen } = useSelector(
    (state: RootState) => state.order
  );

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login');
    } else {
      const ids = [
        constructorItems.bun._id,
        ...ingredients.map((item) => item._id),
        constructorItems.bun._id
      ];
      dispatch(sendNewOrder(ids));
      dispatch(clearIngredients());
      dispatch(fetchFeed());
    }
  };

  const closeOrderModal = () => {
    dispatch(closeModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      isModalOpen={isModalOpen}
    />
  );
};
