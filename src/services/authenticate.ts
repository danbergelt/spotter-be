import { pipe } from 'fp-ts/lib/pipeable';
import { right, left, chain, map, fromEither } from 'fp-ts/lib/TaskEither';
import { unauthorized } from '../utils/errors';
import { HTTPEither, Req } from '../types';
import { DAO } from '../index.types';
import { fromNullable } from 'fp-ts/lib/Either';
import { digestToken } from '../utils/digestToken';
import { Owned } from '../validators/decoders';

const { JWT_SECRET } = process.env;

const isAuthNull = fromNullable(unauthorized());

// auth helper used to protect private endpoints
export const authenticate = <T>(db: DAO, req: Req<T>, dg = digestToken): HTTPEither<Owned<T>> =>
  // extract token from header, digest the JWT, and push to next middleware
  pipe(
    fromEither(isAuthNull(req.headers.authorization)),
    chain(auth => (auth.startsWith('Bearer') ? right(auth) : left(unauthorized()))),
    map(bearer => bearer.split(' ')[1]),
    chain(token => dg(token, db, String(JWT_SECRET))),
    map(user => {
      return { ...req.body, user: user._id };
    })
  );
