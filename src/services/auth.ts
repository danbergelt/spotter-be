import { pipe } from 'fp-ts/lib/pipeable';
import { right, left, chain, map, fromEither } from 'fp-ts/lib/TaskEither';
import { verifyJwt } from '../utils/verifiers';
import { unauthorized } from '../utils/errors';
import { readUser } from './readUser';
import { HTTPEither, Req } from '../types';
import { mongoify } from '../utils/mongoify';
import { DAO } from '../index.types';
import { fromNullable } from 'fp-ts/lib/Either';

const nullable = fromNullable(unauthorized());
const { JWT_SECRET } = process.env;
const deps = { verifyJwt, mongoify, readUser };

// auth helper used to protect private endpoints
export const auth = <T>(db: DAO, req: Req<T>, d = deps): HTTPEither<T> => {
  const { authorization: auth } = req.headers;
  const { verifyJwt, mongoify, readUser } = d;

  // extract token from header, verify as a JWT, verify the decoded id, and push to next middleware
  return pipe(
    fromEither(nullable(auth)),
    chain(auth => (auth.startsWith('Bearer') ? right(auth.split(' ')[1]) : left(unauthorized()))),
    chain(token => fromEither(verifyJwt(token, String(JWT_SECRET)))),
    chain(({ _id }) => fromEither(mongoify(_id))),
    chain(_id => readUser(db, { _id })),
    chain(user => fromEither(nullable(user))),
    map(({ _id }) => {
      return { ...req.body, user: _id };
    })
  );
};
