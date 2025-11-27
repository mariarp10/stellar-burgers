import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RootState, useSelector } from '../../services/store';
import { TUser } from '@utils-types';
import { TRegisterData } from '@api';
import { updateUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user?.name || '',
        email: user?.email || ''
      }));
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const getChangedFields = (
    userData: TUser | null,
    form: typeof formValue
  ): Partial<TRegisterData> => {
    const changes: Partial<TRegisterData> = {};

    if (!userData) return changes;

    if (form.name !== userData.name) {
      changes.name = form.name;
    }

    if (form.email !== userData.email) {
      changes.email = form.email;
    }

    if (form.password) {
      changes.password = form.password;
    }

    return changes;
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(getChangedFields(user, formValue)));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
