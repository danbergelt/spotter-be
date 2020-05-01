import { object, ObjectSchema } from 'yup';
import { user, contact } from './shapes';
import { CASE } from './validators.types';
import { testShape } from './testShape';

// all schema names
export const SCHEMAS = {
  USERS: 'USERS',
  CONTACT: 'CONTACT'
} as const;

// a single function to retrieve a schema by case
// TODO --> namespace into an NPM package and share between FE/BE
export const schema = (CASE: CASE): ObjectSchema => {
  switch (CASE) {
    case SCHEMAS.USERS:
      return object()
        .shape(user)
        .test(...testShape(user));
    case SCHEMAS.CONTACT:
      return object()
        .shape(contact)
        .test(...testShape(contact));
  }
};
