import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { userLogin } from '../../services/slices/userSlice';
import { RootState, useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isLoading, serverError } = useSelector(
    (state: RootState) => state.user
  );

  if (isLoading) {
    return <Preloader />;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(userLogin({ email, password }));
  };

  return (
    <LoginUI
      errorText={serverError || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
