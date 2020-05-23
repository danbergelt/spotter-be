import { hooks } from '../services/hooks';
import { resolver } from '../utils/express';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, fold, fromEither, right, left, map } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { COOKIE_NAME, EMAILS, COLLECTIONS } from '../utils/constants';
import { OK } from 'http-status-codes';
import { _, invalidCredentials } from '../utils/errors';
import { Req, RawUser } from '../types';
import { sendMail } from '../services/sendMail';
import { confirmContactMsg, contactMsg } from '../utils/emailTemplates';
import { sendError, sendAuth } from '../utils/http';
import { validate } from '../services/validate';
import { fromNullable } from 'fp-ts/lib/Either';
import { digestToken } from '../utils/digestToken';
import { hash, compareHash } from '../utils/bcrypt';
import { parseWrite, metadata, success, failure } from '../utils/parsers';
import { Response } from 'express';
import { userDecoder, contactDecoder, User, Contact } from '../validators/decoders';

// destructured constants
const { REF_SECRET } = process.env;
const { TEAM, NO_REPLY, CONTACT } = EMAILS;
const { USERS } = COLLECTIONS;

// compositions
const isUserNull = fromNullable(invalidCredentials());
const isCookieNull = fromNullable(_());
const { readOne, createOne } = hooks<User>(USERS);
const decodeUser = validate(userDecoder);
const decodeContact = validate(contactDecoder);

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

// log in a user
export const login = resolver(async (req: Req<User>, res) => {
  const { db } = req.app.locals;

  return await pipe(
    fromEither(decodeUser(req.body)),
    chain(user => pipe(readOne(db, { email: user.email }))),
    chain(user => fromEither(isUserNull(user))),
    chain(user =>
      pipe(
        compareHash(req.body.password, user.password),
        chain(verified => (verified ? right(user) : left(invalidCredentials())))
      )
    ),
    fold(sendError(res), user => of(sendAuth(user._id, res)))
  )();
});

// register a new user
export const registration = resolver(async (req: Req<RawUser>, res) => {
  const { db } = req.app.locals;
  const { body } = req;

  return await pipe(
    fromEither(decodeUser(body)),
    chain(user => hash(user.password)),
    chain(password => pipe(createOne(db, { ...body, password } as User, 'User'), map(parseWrite))),
    fold(sendError(res), user => of(sendAuth(user._id, res)))
  )();
});

// submit a refresh request --> validate the refresh token, return a new auth token
export const refresh = resolver(async (req: Req, res) => {
  const { db } = req.app.locals;
  const cookie: string | null = req.cookies.ref;

  return await pipe(
    fromEither(isCookieNull(cookie)),
    chain(cookie => digestToken(cookie, db, String(REF_SECRET))),
    fold(
      error => of(res.status(error.status).json(failure({ token: null }))),
      user => of(sendAuth(user._id, res))
    )
  )();
});

// log out a user --> clear the refresh token
export const logout = (_: Req, res: Response): Response =>
  pipe(res.clearCookie(COOKIE_NAME), res => res.status(OK).json(success()));
