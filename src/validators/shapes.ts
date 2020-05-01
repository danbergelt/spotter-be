import { string } from 'yup';

export const user = {
  email: string()
    .email('Invalid email')
    .required('Email is required'),
  password: string()
    .min(6, 'Password too short (6 char minimum)')
    .required('Password is required')
} as const;

export const contact = {
  name: string().required('Name is required'),
  email: string()
    .email('Invalid email')
    .required('Email is required'),
  subject: string().required('Subject is required'),
  message: string().required('Message is required')
} as const;
