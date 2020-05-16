import { pipe } from 'fp-ts/lib/pipeable';
import { right, left, chain, map, fromEither } from 'fp-ts/lib/TaskEither';
import { unauthorized } from '../utils/errors';
import { HTTPEither, Req } from '../types';
import { DAO } from '../index.types';
import { fromNullable } from 'fp-ts/lib/Either';
import { digestToken } from '../utils/digestToken';

const { JWT_SECRET } = process.env;

const isNull = fromNullable(unauthorized());

// auth helper used to protect private endpoints
export const authenticate = <T>(db: DAO, req: Req<T>, digest = digestToken): HTTPEither<T> => {
  const { authorization: auth } = req.headers;

  // extract token from header, verify as a JWT, verify the decoded id, and push to next middleware
  return pipe(
    fromEither(isNull(auth)),
    chain(auth => (auth.startsWith('Bearer') ? right(auth.split(' ')[1]) : left(unauthorized()))),
    chain(token => digest(token, db, String(JWT_SECRET))),
    map(({ _id }) => {
      return { ...req.body, user: _id };
    })
  );
};
