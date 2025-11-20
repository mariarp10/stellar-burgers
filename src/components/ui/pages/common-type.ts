import { Dispatch, SetStateAction, SyntheticEvent } from 'react';

export type PageUIProps = {
  errorText?: string;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: SyntheticEvent) => void;
};
