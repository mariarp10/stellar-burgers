import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { userLogin } from '../../services/slices/userSlice';
import { RootState, useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';

export const Login: FC = () => {
  useEffect(() => {
    console.log(1);
  }, []);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const formSubmitError = useSelector(
    (state: RootState) => state.user.serverError
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(userLogin({ email, password }));
  };

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
