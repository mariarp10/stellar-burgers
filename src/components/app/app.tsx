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
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';

import { fetchFeed } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

import { useEffect } from 'react';

import { useDispatch } from '../../services/store';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeed());
  }, [dispatch]);

  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state as { background?: Location } | null;

  const background = state?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* модалки */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => {
                  navigate('/');
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                onClose={() => {
                  navigate('/feed');
                }}
                title={''}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
      {/* страницы */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetails asPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo asPage />} />
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
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
