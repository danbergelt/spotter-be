import { resolver } from '../utils/express';
import { pipe } from 'fp-ts/lib/pipeable';
import * as AP from 'fp-ts/lib/Apply';
import * as F from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';
import { COOKIE_NAME, EMAILS, SQL } from '../utils/constants';
import { OK } from 'http-status-codes';
import { _, invalidCredentials } from '../utils/errors';
import { sendMail } from '../services/sendMail';
import { confirmContactMsg, contactMsg } from '../utils/emailTemplates';
import { sendError, sendAuth } from '../utils/http';
import { io } from '../services/io';
import { hashingFunction, compareHash } from '../utils/bcrypt';
import {
  metadata,
  success,
  isNonEmpty,
  failure,
  MetaData
} from '../utils/parsers';
import { Response, Request } from 'express';
import {
  userDecoder,
  contactDecoder,
  User,
  Saved,
  Contact
} from '../validators/decoders';
import { userQuery } from '../utils/pg';
import { verifyJwt } from '../utils/jwt';
import { Async, Sync } from '../types';

type Cookie = string;
type MdTuple = [MetaData, MetaData];

const error = F.constant(invalidCredentials);
const secret = String(process.env.REF_SECRET);
const { TEAM, NO_REPLY, CONTACT } = EMAILS;

// send a contact email to the spotter team (x) + confirmation email to the user (y)
type MdTupleBuilder = (c: Contact) => MdTuple;
const mdTupleBuilder: MdTupleBuilder = c =>
  F.tuple(
    metadata(CONTACT, TEAM, c.subject, contactMsg(c.message, c.name, c.email)),
    metadata(NO_REPLY, c.email, 'Hello from Spotter', confirmContactMsg)
  );

export const contact = resolver(
  async (req, res) =>
    await pipe(
      io(contactDecoder, req.body),
      TE.map(mdTupleBuilder),
      TE.chain(([x, y]) =>
        AP.sequenceT(TE.taskEither)(sendMail(x), sendMail(y))
      ),
      TE.fold(sendError(res), () =>
        T.of(res.status(OK).json(success({ message: 'Message sent' })))
      )
    )()
);

// register a new user
export const registration = resolver(
  async (req, res) =>
    await pipe(
      io(userDecoder, req.body),
      TE.chain(u =>
        pipe(
          hashingFunction(u.password),
          TE.chain(hashed => userQuery(SQL.REGISTER, [u.email, hashed]))
        )
      ),
      TE.fold(sendError(res), ([user]) => sendAuth(user.id, res))
    )()
);

// log in a user
type IsUser = (user: Saved<User>) => (bool: boolean) => Async<Saved<User>>;
const isUser: IsUser = user => bool =>
  bool ? TE.right(user) : TE.left(invalidCredentials);

export const login = resolver(
  async (req, res) =>
    await pipe(
      io(userDecoder, req.body),
      TE.chain(a =>
        pipe(
          userQuery(SQL.LOGIN, [a.email]),
          TE.chain(isNonEmpty(error)),
          TE.chain(([user]) =>
            pipe(compareHash(a.password, user.password), TE.chain(isUser(user)))
          )
        )
      ),
      TE.fold(sendError(res), user => sendAuth(user.id, res))
    )()
);

// submit a refresh request --> validate the refresh token, return a new auth token
type ReadC = (cookie: Cookie | undefined) => Sync<Cookie>;
const readC: ReadC = cookie => pipe(cookie, E.fromNullable(_));

export const refresh = resolver(
  async (req, res) =>
    await pipe(
      TE.fromEither(readC(req.cookies.ref)),
      TE.chainEitherK(verifyJwt(secret)),
      TE.chain(jwt => userQuery(SQL.AUTHENTICATE, [jwt.id])),
      TE.chain(isNonEmpty(error)),
      TE.fold(
        ({ status }) => T.of(res.status(status).json(failure({ token: null }))),
        ([user]) => sendAuth(user.id, res)
      )
    )()
);

// log out a user by clearing the refresh token
type Logout = (_: Request, res: Response) => Response;
export const logout: Logout = (_, res) =>
  res
    .clearCookie(COOKIE_NAME)
    .status(OK)
    .json(success({}));
