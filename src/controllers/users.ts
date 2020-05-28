import { resolver } from '../utils/express';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, fold, fromEither, chainEitherK } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { COOKIE_NAME, EMAILS, SQL } from '../utils/constants';
import { OK } from 'http-status-codes';
import { _, invalidCredentials } from '../utils/errors';
import { sendMail } from '../services/sendMail';
import { confirmContactMsg, contactMsg } from '../utils/emailTemplates';
import { sendError, sendAuth } from '../utils/http';
import { io } from '../services/io';
import { fromNullable } from 'fp-ts/lib/Either';
import { hash, compareHash } from '../utils/bcrypt';
import { metadata, success, parseRows, ternary, failure } from '../utils/parsers';
import { Response, Request } from 'express';
import { userDecoder, contactDecoder, User } from '../validators/decoders';
import { loadQuery } from '../utils/pg';
import { verifyJwt } from '../utils/jwt';

// destructured constants
const { REF_SECRET } = process.env;
const { TEAM, NO_REPLY, CONTACT } = EMAILS;

// compositions
const verify = verifyJwt(String(REF_SECRET));
const parser = parseRows(invalidCredentials());
const maybe = ternary(invalidCredentials());
const isCookieNull = fromNullable(_());
const query = loadQuery<User>();

// send a contact email to the spotter team
export const contact = resolver(async (req, res) => {
  const { name, email, subject, message } = req.body;

  return await pipe(
    io(contactDecoder, req.body),
    chain(() => sendMail(metadata(CONTACT, TEAM, subject, contactMsg(message, name, email)))),
    chain(() => sendMail(metadata(NO_REPLY, email, 'Greetings from Spotter', confirmContactMsg()))),
    fold(sendError(res), () => of(res.status(OK).json(success({ message: 'Message sent' }))))
  )();
});

// register a new user
export const registration = resolver(
  async (req, res) =>
    await pipe(
      io(userDecoder, req.body),
      chain(user =>
        pipe(
          hash(user.pw),
          chain(hash => query(SQL.REGISTER, [user.email, hash]))
        )
      ),
      fold(sendError(res), ([{ id }]) => sendAuth(id, res))
    )()
);

// log in a user
export const login = resolver(
  async (req, res) =>
    await pipe(
      io(userDecoder, req.body),
      chain(({ email, pw }) =>
        pipe(
          pipe(query(SQL.LOGIN, [email]), chainEitherK(parser)),
          chain(([user]) => pipe(compareHash(pw, user.pw), chainEitherK(maybe(user))))
        )
      ),
      fold(sendError(res), ({ id }) => sendAuth(id, res))
    )()
);

// submit a refresh request --> validate the refresh token, return a new auth token
export const refresh = resolver(
  async (req, res) =>
    await pipe(
      fromEither(isCookieNull(req.cookies.ref)),
      chainEitherK(verify),
      chain(({ id }) => pipe(query(SQL.AUTHENTICATE, [id]), chainEitherK(parser))),
      fold(
        ({ status }) => of(res.status(status).json(failure({ token: null }))),
        ([{ id }]) => sendAuth(id, res)
      )
    )()
);

// log out a user by clearing the refresh token
export const logout = (_: Request, res: Response): Response =>
  pipe(res.clearCookie(COOKIE_NAME), res => res.status(OK).json(success()));
