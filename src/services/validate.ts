import { ObjectSchema, ValidationError } from 'yup';
import { tryCatch, map } from 'fp-ts/lib/TaskEither';
import { validationErr } from '../utils/errors';
import { HTTPEither } from '../types';
import { pipe } from 'fp-ts/lib/pipeable';

// validating middleware. accepts a schema and validates the request body.
// the request is then either pushed to the next mw on the stack or diverted to the error middleware

export const validate = <T>(schema: ObjectSchema, object: T): HTTPEither<T> => {
  return pipe(
    tryCatch(
      async () => await schema.validate(object),
      error => validationErr((error as ValidationError).message)
    ),
    map(object => {
      return { ...object } as T;
    })
  );
};
