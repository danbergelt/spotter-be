import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { TypeOf } from 'io-ts';
import { userId } from '../validators/brands';
import { pipe } from 'fp-ts/lib/pipeable';
import { ReadonlyNonEmptyArray, head } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { unauthorized } from '../utils/errors';
import { Async, Sync } from '../types';
import { verifyJwt } from '../utils/jwt';
import { Request } from 'express';
import { userQuery } from '../utils/pg';
import { isNonEmpty } from '../utils/parsers';
import { User, Saved } from '../validators/decoders';
import { SQL } from 'src/utils/constants';
import { lookup } from 'fp-ts/lib/ReadonlyArray';
import { constant } from 'fp-ts/lib/function';

type Header = string;
type Bearer = string;
type Token = string;
type Rows = ReadonlyNonEmptyArray<Saved<User>>;
type Authorized = { user: TypeOf<typeof userId> } & { [key: string]: unknown };

const secret = String(process.env.AUTH_SECRET);
const error = constant(unauthorized);

type IsBearer = (h: Header) => Sync<Bearer>;
const isBearer: IsBearer = E.fromPredicate(h => h.startsWith('Bearer '), error);

type Strip = (b: Bearer) => Sync<Token>;
const strip: Strip = b => pipe(lookup(1, b.split(' ')), E.fromOption(error));

type GetHeader = (h: Header | undefined) => Sync<Header>;
const getHeader: GetHeader = h => pipe(h, E.fromNullable(unauthorized));

type InjectUser = (req: Request) => (rows: Rows) => Authorized;
const injectUser: InjectUser = req => rows => ({
  ...req.body,
  user: head(rows).id
});

// authenticate a json web token from an authorization header, and inject the user id into the request
type Authorize = (req: Request) => Async<Authorized>;
const authorize: Authorize = req =>
  pipe(
    TE.fromEither(getHeader(req.headers.authorization)),
    TE.chainEitherK(isBearer),
    TE.chainEitherK(strip),
    TE.chainEitherK(verifyJwt(secret)),
    TE.chain(jwt => userQuery(SQL.AUTHENTICATE, [jwt.id])),
    TE.chain(isNonEmpty(error)),
    TE.map(injectUser(req))
  );

export { authorize, isBearer, strip, getHeader, injectUser };
