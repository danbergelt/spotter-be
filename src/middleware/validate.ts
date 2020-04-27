import { ObjectSchema as Schema } from 'yup';
import { BAD_REQUEST } from 'http-status-codes';
import { fold } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';
import { tc } from '../utils/tc';
import { wrap } from '../utils/wrap';
import { Fn } from '../utils/wrap.types';

// validating middleware. accepts a schema and validates the request body.
// the request is then either pushed to the next mw on the stack or diverted to the error middleware

export const validate = (schema: Schema): Fn => {
  return wrap(async ({ body }, _res, next) => {
    return await pipe(
      tc(async () => await schema.validate(body))(BAD_REQUEST),
      fold(
        e => of(next(e)),
        () => of(next())
      )
    )();
  });
};
