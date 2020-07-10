import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { TypeOf } from 'io-ts';
import { userId } from '../validators/brands';
import { pipe } from 'fp-ts/lib/pipeable';
import { unauthorized } from '../utils/errors';
import { Async, Sync } from '../types';
import { verifyJwt } from '../utils/jwt';
import { Request } from 'express';
import { query } from '../utils/pg';
import { pluck } from '../utils/parsers';
import { SQL } from '../utils/constants';
import { User, Saved } from '../validators/decoders';
import { flow } from 'fp-ts/lib/function';

type Header = string;
type Token = string;
type Body = { user: TypeOf<typeof userId> } & { [key: string]: unknown };

const secret = String(process.env.AUTH_SECRET);
const error = unauthorized;
const userQuery = query<User>();
const getHead = pluck(error);

// strip an auth token from its header
type Strip = (h: Header | undefined) => Sync<Token>;
const strip: Strip = flow(
  b => (!!b && b.startsWith('Bearer ') ? E.right(b) : E.left(error)),
  E.map(b => b.split(' ')),
  E.map(a => a[1])
);

// inject a user id into the request body as foreign key
type Inject = (req: Request) => (user: Saved<User>) => Body;
const inject: Inject = req => user => ({ ...req.body, user: user.id });

// authorize an incoming http request
type Authorize = (req: Request) => Async<Body>;
const authorize: Authorize = req =>
  pipe(
    TE.fromEither(strip(req.headers.authorization)),
    TE.chainEitherK(verifyJwt(secret)),
    TE.map(jwt => [jwt.id]),
    TE.chain(userQuery(SQL.AUTHENTICATE)),
    TE.chainEitherK(getHead),
    TE.map(inject(req))
  );

export { strip, inject, authorize };
