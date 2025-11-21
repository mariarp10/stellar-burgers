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
  const { data, isAuth } = useSelector((store: RootState) => store.user);

  if (!data) {
    return <Preloader />;
  }

  // если авторизован то прогоняю со страницы
  if (onlyUnAuth && isAuth) {
    console.log('логин есть редирект на главную');
    return <Navigate to={'/'} replace />;
  }

  // если не авторизован то отправляю логиниться
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
