import { resolver } from '../utils/express';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, fold, fromEither, chainEitherK } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { COOKIE_NAME, EMAILS, SQL } from '../utils/constants';
import { OK } from 'http-status-codes';
import { _, invalidCredentials } from '../utils/errors';
import { Req, RawUser } from '../types';
import { sendMail } from '../services/sendMail';
import { confirmContactMsg, contactMsg } from '../utils/emailTemplates';
import { sendError, sendAuth } from '../utils/http';
import { validate } from '../services/validate';
import { fromNullable } from 'fp-ts/lib/Either';
import { hash, compareHash } from '../utils/bcrypt';
import { metadata, success, parseRows, ternary, couple } from '../utils/parsers';
import { Response } from 'express';
import { userDecoder, contactDecoder, User, Contact } from '../validators/decoders';
import { loadQuery } from '../utils/pg';
import { verifyJwt } from '../utils/jwt';

// destructured constants
const { REF_SECRET } = process.env;
const { TEAM, NO_REPLY, CONTACT } = EMAILS;

// compositions
const parser = parseRows(invalidCredentials());
const maybe = ternary(invalidCredentials());
const isCookieNull = fromNullable(_());
const decodeUser = validate(userDecoder);
const decodeContact = validate(contactDecoder);
const query = loadQuery<User>();

// send a contact email to the spotter team
export const contact = resolver(async (req: Req<Contact>, res) => {
  const { name, email, subject, message } = req.body;

  return await pipe(
    fromEither(decodeContact(req.body)),
    chain(() => sendMail(metadata(CONTACT, TEAM, subject, contactMsg(message, name, email)))),
    chain(() => sendMail(metadata(NO_REPLY, email, 'Greetings from Spotter', confirmContactMsg()))),
    fold(sendError(res), () => of(res.status(OK).json(success({ message: 'Message sent' }))))
  )();
});

// register a new user
export const registration = resolver(
  async (req: Req<RawUser>, res) =>
    await pipe(
      fromEither(decodeUser(req.body)),
      chain(({ pw }) => hash(pw)),
      chain(pw => query(SQL.REGISTER, [req.body.email, pw])),
      fold(sendError(res), ([{ id }]) => sendAuth(id, res))
    )()
);

// log in a user
export const login = resolver(
  async (req: Req<User>, res) =>
    await pipe(
      fromEither(decodeUser(req.body)),
      chain(({ email }) => couple(query(SQL.LOGIN, [email]))(parser)),
      chain(([user]) => couple(compareHash(req.body.pw, user.pw))(maybe(user))),
      fold(sendError(res), ({ id }) => sendAuth(id, res))
    )()
);

// submit a refresh request --> validate the refresh token, return a new auth token
export const refresh = resolver(
  async (req: Req, res) =>
    await pipe(
      fromEither(isCookieNull(req.cookies.ref)),
      chainEitherK(verifyJwt(String(REF_SECRET))),
      chain(({ id }) => couple(query(SQL.AUTHENTICATE, [id]))(parser)),
      fold(
        ({ status }) => of(res.status(status).json(success({ token: null }))),
        ([{ id }]) => sendAuth(id, res)
      )
    )()
);

// log out a user by clearing the refresh token
export const logout = (_: Req, res: Response): Response =>
  pipe(res.clearCookie(COOKIE_NAME), res => res.status(OK).json(success()));
