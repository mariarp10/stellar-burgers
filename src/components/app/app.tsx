import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';

import { useNavigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';

import { useEffect } from 'react';

import { fetchIngredients } from '../../services/slices/ingredientsSlice';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <Modal
              onClose={() => {
                navigate('/feed');
              }}
              title={'test title order info'}
            >
              <OrderInfo />
            </Modal>
          }
        />
        <Route path='/login' element={<ProtectedRoute />}>
          <Route path='/login' element={<Login />} />
        </Route>
        <Route path='/register' element={<ProtectedRoute />}>
          <Route path='/register' element={<Register />} />
        </Route>
        <Route path='/forgot-password' element={<ProtectedRoute />}>
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Route>
        <Route path='/reset-password' element={<ProtectedRoute />}>
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route path='/profile' element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path='/profile/orders' element={<ProtectedRoute />}>
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={'test title order info'}
                onClose={() => {
                  navigate('/profile/orders');
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Route>
        <Route
          path='/ingredients/:id'
          element={
            <Modal
              title='test title ingredients'
              onClose={() => {
                navigate('/');
              }}
            >
              <IngredientDetails />
            </Modal>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
