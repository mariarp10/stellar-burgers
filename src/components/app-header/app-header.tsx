import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useLocation } from 'react-router-dom';

export const AppHeader: FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const constructorIsActive = path === '/' || path.startsWith('/ingredients');
  const feedIsActive = path.startsWith('/feed');

  return (
    <AppHeaderUI
      userName=''
      constructorIsActive={constructorIsActive}
      feedIsActive={feedIsActive}
    />
  );
};
