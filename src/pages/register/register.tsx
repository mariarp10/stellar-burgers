import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { userRegister } from '../../services/slices/user-slice/userSlice';
import { TRegisterData } from '@api';
import { RootState, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const dispatch = useDispatch();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleNameBlur = () => {
    if (!userName.trim()) {
      setNameError('Введите имя');
    } else {
      setNameError('');
    }
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError('Введите e-mail');
    } else if (!email.includes('@')) {
      setEmailError('Введите e-mail в формате example@email.com');
    } else {
      setEmailError('');
    }
  };

  const { isLoading, serverError } = useSelector(
    (state: RootState) => state.user
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const newUserData: TRegisterData = {
      email,
      name: userName,
      password
    };

    dispatch(userRegister(newUserData));
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={serverError || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      nameError={nameError}
      emailError={emailError}
      onNameBlur={handleNameBlur}
      onEmailBlur={handleEmailBlur}
    />
  );
};
