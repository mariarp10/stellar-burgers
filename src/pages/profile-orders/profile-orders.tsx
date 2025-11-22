import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { getUserOrders } from '../../services/slices/userSlice';
import { useEffect } from 'react';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const { orders } = useSelector((state: RootState) => state.user);

  return <ProfileOrdersUI orders={orders} />;
};
