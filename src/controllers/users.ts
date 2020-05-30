import { resolver } from '../utils/express';
import { pipe } from 'fp-ts/lib/pipeable';
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
import { hash, compareHash } from '../utils/bcrypt';
import { metadata, success, parseRows, ternary, failure } from '../utils/parsers';
import { Response, Request } from 'express';
import { userDecoder, contactDecoder } from '../validators/decoders';
import { userQuery } from '../utils/pg';
import { verifyJwt } from '../utils/jwt';
import { Async } from '../types';

// destructured constants
const sec = String(process.env.REF_SECRET);
const { TEAM, NO_REPLY, CONTACT } = EMAILS;

// compositions
const parse = parseRows(invalidCredentials());
const maybe = ternary(invalidCredentials());
const read = (x: string | undefined): Async<string> => pipe(E.fromNullable(_())(x), TE.fromEither);
const lazy = <T>(x: T): F.Lazy<T> => (): T => x;

// send a contact email to the spotter team (x) + confirmation email to the user (y)
const message = 'Message sent';
export const contact = resolver(
  async (req, res) =>
    await pipe(
      io(contactDecoder, req.body),
      TE.map(a => [
        metadata(CONTACT, TEAM, a.subject, contactMsg(a.message, name, a.email)),
        metadata(NO_REPLY, a.email, 'Hello from Spotter', confirmContactMsg())
      ]),
      TE.chain(([x, y]) => pipe(sendMail(x), TE.chain(lazy(sendMail(y))))),
      TE.fold(sendError(res), lazy(T.of(res.status(OK).json(success({ message })))))
    )()
);

// register a new user
export const registration = resolver(
  async (req, res) =>
    await pipe(
      io(userDecoder, req.body),
      TE.chain(a =>
        pipe(
          hash(a.pw),
          TE.chain(hash => userQuery(SQL.REGISTER, [a.email, hash]))
        )
      ),
      TE.fold(sendError(res), ([user]) => sendAuth(user.id, res))
    )()
);

// log in a user
export const login = resolver(
  async (req, res) =>
    await pipe(
      io(userDecoder, req.body),
      TE.chain(a =>
        pipe(
          userQuery(SQL.LOGIN, [a.email]),
          TE.chain(parse),
          TE.chain(([user]) => pipe(compareHash(a.pw, user.pw), TE.chain(maybe(user))))
        )
      ),
      TE.fold(sendError(res), user => sendAuth(user.id, res))
    )()
);

// submit a refresh request --> validate the refresh token, return a new auth token
const token = null;
export const refresh = resolver(
  async (req, res) =>
    await pipe(
      read(req.cookies.ref),
      TE.chain(t => pipe(verifyJwt(sec)(t), TE.fromEither)),
      TE.chain(jwt => userQuery(SQL.AUTHENTICATE, [jwt.id])),
      TE.chain(parse),
      TE.fold(
        err => T.of(res.status(err.status).json(failure({ token }))),
        ([user]) => sendAuth(user.id, res)
      )
    )()
);

// log out a user by clearing the refresh token
export const logout = (_: Request, res: Response): Response =>
  pipe(res.clearCookie(COOKIE_NAME), res => res.status(OK).json(success()));
