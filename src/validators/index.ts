import { object, ObjectSchema } from 'yup';
import { testShape } from './testShape';
import { user } from './shapes';
// eslint-disable-next-line
import { Shape, CASE } from './validators.types';

// all schema names
export const SCHEMAS = {
  USERS: 'USERS'
} as const;

// a single function to retrieve a schema by case
// TODO --> namespace into an NPM package and share between FE/BE
export const schema = (CASE: CASE): ObjectSchema => {
  switch (CASE) {
    case SCHEMAS.USERS:
      return object()
        .shape(user)
        .test('obj shape', 'Invalid data', <T>(obj: Shape<T>) => testShape(obj, user));
  }
};
