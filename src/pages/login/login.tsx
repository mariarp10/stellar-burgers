import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { userLoginThunk } from '../../services/slices/userSlice';
import { RootState, useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const formSubmitError = useSelector(
    (state: RootState) => state.user.formSubmitError
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(userLoginThunk({ email, password }));
  };

  useEffect(() => {
    if (isAuth) {
      navigate('/profile');
    }
  }, [isAuth, navigate]);

  return (
    <LoginUI
      errorText={formSubmitError || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
