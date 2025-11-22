import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useState } from 'react';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { getUserOrders } from '../../services/slices/userSlice';
import { useEffect } from 'react';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const { orders } = useSelector((state: RootState) => state.user);

  return <ProfileOrdersUI orders={orders} />;
};
