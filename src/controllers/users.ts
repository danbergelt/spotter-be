import { resolver, Controller } from '../utils/express';
import { pipe } from 'fp-ts/lib/pipeable';
import { sequenceT } from 'fp-ts/lib/Apply';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { COOKIE_NAME, SQL } from '../utils/constants';
import { OK } from 'http-status-codes';
import { invalidCredentials } from '../utils/errors';
import { sendMail } from '../services/sendMail';
import { sendError, sendAuth } from '../utils/http';
import { io } from '../services/io';
import { hashingFunction, compareHash } from '../utils/bcrypt';
import * as P from '../utils/parsers';
import { userDecoder, contactDecoder, User } from '../validators/decoders';
import { query } from '../utils/pg';
import { verifyJwt } from '../utils/jwt';
import { toSpotter, toUser } from '../utils/metadata';

const error = invalidCredentials;
const secret = String(process.env.REF_SECRET);

const validateContact = io(contactDecoder);
const validateUser = io(userDecoder);
const userQuery = query<User>(error);

// send a contact email to the spotter team (a) + confirmation email to the user (b)
export const contact = resolver(
  async (req, res) =>
    await pipe(
      validateContact(req.body),
      TE.chain(c =>
        sequenceT(TE.taskEither)(sendMail(toSpotter(c)), sendMail(toUser(c)))
      ),
      TE.fold(sendError(res), () =>
        of(res.status(OK).json(P.success({ message: 'Message sent' })))
      )
    )()
);

// register a new user
export const registration = resolver(
  async (req, res) =>
    await pipe(
      validateUser(req.body),
      TE.chain(u =>
        pipe(
          hashingFunction(u.password),
          TE.chain(hash => userQuery(SQL.REGISTER, [u.email, hash]))
        )
      ),
      TE.fold(sendError(res), ([user]) => sendAuth(user.id, res))
    )()
);

// log in a user
export const login = resolver(
  async (req, res) =>
    await pipe(
      validateUser(req.body),
      TE.chain(attempt =>
        pipe(
          userQuery(SQL.LOGIN, [attempt.email]),
          TE.chain(([user]) =>
            pipe(
              compareHash(attempt.password, user.password),
              TE.chain(isHash => (isHash ? TE.right(user) : TE.left(error)))
            )
          )
        )
      ),
      TE.fold(sendError(res), user => sendAuth(user.id, res))
    )()
);

// submit a refresh request --> validate the refresh token, return a new auth token
export const refresh = resolver(
  async (req, res) =>
    await pipe(
      TE.fromEither(E.fromNullable(error)(req.cookies.ref)),
      TE.chainEitherK(verifyJwt(secret)),
      TE.chain(jwt => userQuery(SQL.AUTHENTICATE, [jwt.id])),
      TE.fold(
        err => of(res.status(err.status).json(P.failure({ token: null }))),
        ([user]) => sendAuth(user.id, res)
      )
    )()
);

// log out a user by clearing the refresh token
export const logout: Controller = (_, res) =>
  res
    .clearCookie(COOKIE_NAME)
    .status(OK)
    .json(P.success({}));
