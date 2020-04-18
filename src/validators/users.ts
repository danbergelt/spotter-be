import { object, string } from 'yup';

export const users = object().shape({
  email: string()
    .email('Invalid email')
    .required('Email/password is required'),
  password: string()
    .min(6, 'Password too short (6 char minimum)')
    .required('Email/password is required')
});
