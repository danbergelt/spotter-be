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
import { flow, constant, tuple } from 'fp-ts/lib/function';
import { split, startsWith, prop, nth, toString } from 'ramda';

type Header = string;
type Token = string;
type Authorized = { user: TypeOf<typeof userId> } & { [key: string]: unknown };

const secret = String(process.env.AUTH_SECRET);
const userQuery = query<User>();

// strip an auth token from it's header
type Strip = (h: Header | undefined) => Sync<Token>;
const strip: Strip = flow(
  E.fromNullable(unauthorized),
  E.chain(E.fromPredicate(startsWith('Bearer '), constant(unauthorized))),
  E.map(split(' ')),
  E.map(nth(1)),
  E.map(toString)
);

// inject the user id associated with the request into the request body
type Inject = (req: Request) => (user: Saved<User>) => Authorized;
const inject: Inject = req => user => ({ ...req.body, user: user.id });

// authorize a request
type Authorize = (req: Request) => Async<Authorized>;
const authorize: Authorize = req =>
  pipe(
    TE.fromEither(strip(req.headers.authorization)),
    TE.chainEitherK(verifyJwt(secret)),
    TE.map(prop('id')),
    TE.map(tuple),
    TE.chain(userQuery(SQL.AUTHENTICATE)),
    TE.chainEitherK(pluck(unauthorized)),
    TE.map(inject(req))
  );

export { strip, inject, authorize };
