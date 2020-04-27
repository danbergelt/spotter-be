import { object, string, ObjectSchema } from 'yup';

// all schema names
export const SCHEMAS = {
  USERS: 'USERS'
} as const;

type CASE = typeof SCHEMAS[keyof typeof SCHEMAS];

// a single function to retrieve a schema by case
// TODO --> namespace into an NPM package and share between FE/BE
export const schema = (CASE: CASE): ObjectSchema => {
  switch (CASE) {
    case SCHEMAS.USERS:
      return object().shape({
        email: string()
          .email('Invalid email')
          .required('Email/password is required'),
        password: string()
          .min(6, 'Password too short (6 char minimum)')
          .required('Email/password is required')
      });
  }
};
