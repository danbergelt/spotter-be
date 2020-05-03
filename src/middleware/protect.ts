import { resolver, Fn } from '../utils/resolver';
import { pipe } from 'fp-ts/lib/pipeable';
import { right, left, chain, chainEitherK, fold } from 'fp-ts/lib/TaskEither';
import { verifyJwt } from '../utils/verifiers';
import { unauthorized } from '../utils/errors';
import { readUser } from '../services/readUser';
import { HTTPEither } from '../types';
import { of } from 'fp-ts/lib/Task';
import { mongoify } from '../utils/mongoify';

const { JWT_SECRET } = process.env;

// auth middleware used to protect private endpoints

export const protect = (v = verifyJwt, m = mongoify, r = readUser): Fn =>
  resolver(async ({ body, app, headers }, _, next) => {
    const { db } = app.locals;
    const auth = headers.authorization;

    // extract token from header, verify as a JWT, verify the decoded id, and push to next middleware
    return await pipe(
      ((): HTTPEither<string> => (auth ? right(auth) : left(unauthorized())))(),
      chain(auth => (auth.startsWith('Bearer') ? right(auth.split(' ')[1]) : left(unauthorized()))),
      chainEitherK(token => v(token, String(JWT_SECRET))),
      chainEitherK(({ _id }) => m(_id)),
      chain(_id => r(db, { _id })),
      fold(
        e => of(next(e)),
        // inject the auth'd user as a foreign key into the body
        ({ _id }) => {
          body.user = _id;
          return of(next());
        }
      )
    )();
  });
