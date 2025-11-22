import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useState } from 'react';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { getUserOrders } from '../../services/slices/userSlice';
import { useEffect } from 'react';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector((state: RootState) => state.user.orders);

  return <ProfileOrdersUI orders={orders} />;
};
