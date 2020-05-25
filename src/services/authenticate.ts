import { pipe } from 'fp-ts/lib/pipeable';
import { right, left, chain, map, fromEither } from 'fp-ts/lib/TaskEither';
import { unauthorized } from '../utils/errors';
import { Async, Req } from '../types';
import { fromNullable } from 'fp-ts/lib/Either';
import { Owned, User } from '../validators/decoders';
import { verifyJwt } from '../utils/jwt';
import { loadQuery } from '../utils/pg';
import { SQL } from '../utils/constants';

const { JWT_SECRET } = process.env;

const isNull = fromNullable(unauthorized());
const query = loadQuery<User>();
const deps = { verifyJwt, query };

// auth helper used to protect private endpoints
export const authenticate = <T>(req: Req<T>, { verifyJwt, query } = deps): Async<Owned<T>> =>
  pipe(
    fromEither(isNull(req.headers.authorization)),
    chain(auth => (auth.startsWith('Bearer') ? right(auth) : left(unauthorized()))),
    map(header => header.split(' ')[1]),
    chain(token => fromEither(verifyJwt(token, String(JWT_SECRET)))),
    chain(({ id }) => query(SQL.AUTHENTICATE, [id])),
    chain(([user]) => fromEither(isNull(user))),
    map(({ id }) => ({ ...req.body, user: id }))
  );
