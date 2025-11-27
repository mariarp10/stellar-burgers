import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  sendNewOrder,
  closeModal,
  openModal
} from '../../services/slices/orderSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.assembledBurger
  );

  const { isAuth } = useSelector((state: RootState) => state.user);

  const { orderModalData, isModalOpen, orderRequestSent } = useSelector(
    (state: RootState) => state.order
  );

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };
  // не разобралась какой UX лучше для модалки, сделала на свой вкус
  const onOrderClick = () => {
    if (!constructorItems.bun) return;

    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (orderRequestSent) return;

    const ids = [
      constructorItems.bun._id,
      ...ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(openModal());
    dispatch(sendNewOrder(ids));
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
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      isModalOpen={isModalOpen}
    />
  );
};
