import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { unauthorized } from '../utils/errors';
import { Async } from '../types';
import { verifyJwt } from '../utils/jwt';
import { SQL } from '../utils/constants';
import { parseRows } from '../utils/parsers';
import { Request } from 'express';
import { userQuery } from 'src/utils/pg';

const sec = String(process.env.JWT_SECRET);

const parse = parseRows(unauthorized());
const read = (x: string | undefined): Async<string> =>
  pipe(E.fromNullable(unauthorized())(x), TE.fromEither);
const strip = (x: string): Async<string> =>
  pipe(x.startsWith('Bearer ') ? E.right(x.split(' ')[1]) : E.left(unauthorized()), TE.fromEither);

// authenticate a json web token from a request header
export const authenticate = <T>(req: Request, v = verifyJwt, q = userQuery): Async<T> =>
  pipe(
    read(req.headers.authorization),
    TE.chain(strip),
    TE.chain(t => pipe(v(sec)(t), TE.fromEither)),
    TE.chain(jwt => q(SQL.AUTHENTICATE, [jwt.id])),
    TE.chain(parse),
    TE.map(([user]) => ({ ...req.body, user: user.id }))
  );
