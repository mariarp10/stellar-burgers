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
  const { isLoading, isAuth, checkAuth } = useSelector(
    (store: RootState) => store.user
  );

  if (!checkAuth || isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuth) {
    return <Navigate to={'/'} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
