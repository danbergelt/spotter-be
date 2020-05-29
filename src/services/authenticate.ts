import { pipe } from 'fp-ts/lib/pipeable';
import { chain, map, fromEither, chainEitherK } from 'fp-ts/lib/TaskEither';
import { unauthorized } from '../utils/errors';
import { Async, Sync } from '../types';
import { fromNullable, left, right } from 'fp-ts/lib/Either';
import { verifyJwt } from '../utils/jwt';
import { userQuery } from '../utils/pg';
import { SQL } from '../utils/constants';
import { parseRows } from '../utils/parsers';
import { Request } from 'express';

const { JWT_SECRET } = process.env;
const authSecret = String(JWT_SECRET);

// compositions
const parser = parseRows(unauthorized());
const isTokenNull = fromNullable(unauthorized());
const deps = { verifyJwt, query: userQuery };
const stripToken = (a: string): Sync<string> =>
  a.startsWith('Bearer ') ? right(a.split(' ')[1]) : left(unauthorized());

// auth helper used to protect private endpoints
export const authenticate = <T>(req: Request, { verifyJwt, query } = deps): Async<T> =>
  pipe(
    fromEither(isTokenNull(req.headers.authorization)),
    chainEitherK(stripToken),
    chainEitherK(verifyJwt(authSecret)),
    chain(({ id }) => pipe(query(SQL.AUTHENTICATE, [id]), chainEitherK(parser))),
    map(([{ id }]) => ({ ...req.body, user: id }))
  );
