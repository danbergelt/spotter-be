import { ObjectSchema } from 'yup';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { tc } from '../utils/tc';
import { wrap } from '../utils/wrap';
import { Fn } from '../utils/wrap.types';
import { e } from '../utils/e';

// validating middleware. accepts a schema and validates the request body.
// the request is then either pushed to the next mw on the stack or diverted to the error middleware

export const vdate = (schema: ObjectSchema | null): Fn => {
  return wrap(async ({ body }, _res, next) => {
    // invalid schema case
    if (!schema) return next(e('Something went wrong!', INTERNAL_SERVER_ERROR));

    return await pipe(
      tc(async () => await schema.validate(body))(BAD_REQUEST),
      fold(
        e => of(next(e)),
        () => of(next())
      )
    )();
  });
};
