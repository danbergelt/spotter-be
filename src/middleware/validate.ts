import { ObjectSchema as Schema, ValidationError } from 'yup';
import { fold, tryCatch } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';
import { resolver } from '../utils/resolver';
import { Fn } from '../utils/resolver';
import { validationErr } from '../utils/errors';

// validating middleware. accepts a schema and validates the request body.
// the request is then either pushed to the next mw on the stack or diverted to the error middleware

export const validate = (schema: Schema): Fn => {
  return resolver(async ({ body }, _res, next) => {
    return await pipe(
      tryCatch(
        async () => await schema.validate(body),
        error => validationErr((error as ValidationError).message)
      ),
      fold(
        e => of(next(e)),
        () => of(next())
      )
    )();
  });
};
