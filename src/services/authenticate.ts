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
export const authenticate = <T>(db: DAO, req: Req<T>, digest = digestToken): HTTPEither<Owned<T>> =>
  pipe(
    fromEither(isAuthNull(req.headers.authorization)),
    chain(auth => (auth.startsWith('Bearer') ? right(auth.split(' ')[1]) : left(unauthorized()))),
    chain(token => digest(token, db, String(JWT_SECRET))),
    map(user => ({ ...req.body, user: user._id }))
  );
