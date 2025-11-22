import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState, useSelector } from '../../services/store';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps) => {
  const { isLoading, isAuth } = useSelector((store: RootState) => store.user);

  if (isLoading) {
    return <Preloader />;
  }

  // если авторизован то прогоняю со страницы
  if (onlyUnAuth && isAuth) {
    return <Navigate to={'/'} replace />;
  }

  // если не авторизован то отправляю логиниться
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
