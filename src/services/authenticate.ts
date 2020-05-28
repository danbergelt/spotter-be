import { pipe } from 'fp-ts/lib/pipeable';
import { chain, map, fromEither, chainEitherK } from 'fp-ts/lib/TaskEither';
import { unauthorized } from '../utils/errors';
import { Async, Sync } from '../types';
import { fromNullable, left, right } from 'fp-ts/lib/Either';
import { Owned, User } from '../validators/decoders';
import { verifyJwt } from '../utils/jwt';
import { loadQuery } from '../utils/pg';
import { SQL } from '../utils/constants';
import { parseRows, join } from '../utils/parsers';
import { Request } from 'express';

const { JWT_SECRET } = process.env;
const authSecret = String(JWT_SECRET);

// compositions
const parser = parseRows(unauthorized());
const isTokenNull = fromNullable(unauthorized());
const query = loadQuery<User>();
const deps = { verifyJwt, query };
const stripToken = (a: string): Sync<string> =>
  a.startsWith('Bearer ') ? right(a.split(' ')[1]) : left(unauthorized());

// auth helper used to protect private endpoints
export const authenticate = <T>(req: Request, { verifyJwt, query } = deps): Async<Owned<T>> =>
  pipe(
    fromEither(isTokenNull(req.headers.authorization)),
    chainEitherK(stripToken),
    chainEitherK(verifyJwt(authSecret)),
    chain(({ id }) => join(query(SQL.AUTHENTICATE, [id]), parser)),
    map(([{ id }]) => ({ ...req.body, user: id }))
  );
