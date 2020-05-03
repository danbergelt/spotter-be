import { pipe } from 'fp-ts/lib/pipeable';
import { right, left, chain, chainEitherK, map } from 'fp-ts/lib/TaskEither';
import { verifyJwt } from '../utils/verifiers';
import { unauthorized } from '../utils/errors';
import { readUser } from './readUser';
import { HTTPEither, Req } from '../types';
import { mongoify } from '../utils/mongoify';
import { DAO } from '../index.types';
import { ObjectID } from 'mongodb';

const { JWT_SECRET } = process.env;

const deps = { verifyJwt, mongoify, readUser };

// auth helper used to protect private endpoints
export const auth = <T>(db: DAO, req: Req<T>, d = deps): HTTPEither<WithAuth<T>> => {
  const { authorization } = req.headers;
  const { verifyJwt, mongoify, readUser } = d;

  // extract token from header, verify as a JWT, verify the decoded id, and push to next middleware
  return pipe(
    ((): HTTPEither<string> => (authorization ? right(authorization) : left(unauthorized())))(),
    chain(auth => (auth.startsWith('Bearer') ? right(auth.split(' ')[1]) : left(unauthorized()))),
    chainEitherK(token => verifyJwt(token, String(JWT_SECRET))),
    chainEitherK(({ _id }) => mongoify(_id)),
    chain(_id => readUser(db, { _id })),
    map(({ _id }) => {
      return { ...req.body, user: _id };
    })
  );
};

type WithAuth<T> = T & { user: ObjectID };
