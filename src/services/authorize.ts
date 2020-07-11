import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { TypeOf } from 'io-ts';
import { userId } from '../validators/brands';
import { pipe } from 'fp-ts/lib/pipeable';
import { unauthorized } from '../utils/errors';
import { Async } from '../types';
import { verifyJwt } from '../utils/jwt';
import { Request } from 'express';
import { query } from '../utils/pg';
import { SQL } from '../utils/constants';
import { User, Saved } from '../validators/decoders';
import { head } from 'fp-ts/lib/ReadonlyNonEmptyArray';

type Header = string;
type Token = string;
type Body = { user: TypeOf<typeof userId> } & { [key: string]: unknown };

const secret = String(process.env.AUTH_SECRET);
const userQuery = query<User>(unauthorized);

// strip an auth token from its header
type Strip = (h: Header | undefined) => Async<Token>;
const strip: Strip = h =>
  pipe(
    h && h.startsWith('Bearer ') ? E.right(h) : E.left(unauthorized),
    E.map(b => b.split(' ')[1]),
    TE.fromEither
  );

// inject a user id into the request body as foreign key
type Inject = (req: Request) => (user: Saved<User>) => Body;
const inject: Inject = req => user => ({ ...req.body, user: user.id });

// authorize an incoming http request
type Authorize = (req: Request) => Async<Body>;
const authorize: Authorize = req =>
  pipe(
    strip(req.headers.authorization),
    TE.chainEitherK(verifyJwt(secret)),
    TE.chain(jwt => userQuery(SQL.AUTHENTICATE, [jwt.id])),
    TE.map(head),
    TE.map(inject(req))
  );

export { strip, inject, authorize };
