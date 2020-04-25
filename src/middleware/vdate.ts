import { ObjectSchema } from 'yup';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import * as P from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { tc } from '../utils/tc';
import { wrap } from '../utils/wrap';
import { Fn } from '../utils/wrap.types';

// validating middleware. accepts a schema and validates the request body.
// the request is then either pushed to the next mw on the stack or diverted to the error middleware

export const vdate = (schema: ObjectSchema | null): Fn => {
  return wrap(async ({ body }, _res, next) => {
    // invalid schema case
    if (!schema) return next({ message: 'Something went wrong!', status: INTERNAL_SERVER_ERROR });

    return await P.pipe(
      tc(BAD_REQUEST, async () => await schema.validate(body)),
      TE.fold(
        e => T.of(next(e)),
        () => T.of(next())
      )
    )();
  });
};
