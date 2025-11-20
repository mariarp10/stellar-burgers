import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useLocation } from 'react-router-dom';
import { RootState, useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const userName = useSelector((state: RootState) => state.user.data?.name);
  const isAuth = useSelector((state: RootState) => state.user.isAuth);

  const constructorIsActive = path === '/' || path.startsWith('/ingredients');
  const feedIsActive = path.startsWith('/feed');

  return (
    <AppHeaderUI
      isAuth={isAuth}
      userName={isAuth ? userName : 'Личный кабинет'}
      constructorIsActive={constructorIsActive}
      feedIsActive={feedIsActive}
    />
  );
};
