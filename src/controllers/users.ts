import { hooks } from '../services/hooks';
import { resolver } from '../utils/express';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, fold, fromEither, right, left, map } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { COOKIE_NAME, EMAILS, COLLECTIONS } from '../utils/constants';
import { OK, BAD_REQUEST } from 'http-status-codes';
import { _, invalidCredentials } from '../utils/errors';
import { Req } from '../types';
import { sendMail } from '../services/sendMail';
import { confirmContactMsg, contactMsg } from '../utils/emailTemplates';
import { sendError, sendAuth } from '../utils/http';
import { validate } from '../services/validate';
import { fromNullable } from 'fp-ts/lib/Either';
import { digestToken } from '../utils/digestToken';
import { verifyEncryption, encrypt } from '../utils/bcrypt';
import { e, parseWrite, metadata, success, failure } from '../utils/parsers';
import { Response } from 'express';
import { userDecoder, contactDecoder, User, Contact } from '../validators/decoders';
import { ObjectID } from 'mongodb';

// destructured constants
const { REF_SECRET } = process.env;
const { TEAM, NO_REPLY, CONTACT } = EMAILS;
const { USERS } = COLLECTIONS;

// compositions
const isUserNull = fromNullable(invalidCredentials());
const isCookieNull = fromNullable(_());
const { readOne, createOne } = hooks<User>(USERS);

export const contact = resolver(async (req: Req<Contact>, res) => {
  const { name, email, subject, message } = req.body;

  return await pipe(
    fromEither(validate(contactDecoder, req.body)),
    chain(() => sendMail(metadata(CONTACT, TEAM, subject, contactMsg(message, name, email)))),
    chain(() => sendMail(metadata(NO_REPLY, email, 'Greetings from Spotter', confirmContactMsg()))),
    fold(
      error => of(sendError(error, res)),
      () => of(res.status(OK).json(success({ message: 'Message sent' })))
    )
  )();
});

export const login = resolver(async (req: Req<User>, res) => {
  const { password } = req.body;
  const { db } = req.app.locals;

  return await pipe(
    fromEither(validate(userDecoder, req.body)),
    chain(user => readOne(db, { email: user.email })),
    chain(user => fromEither(isUserNull(user))),
    chain(user =>
      pipe(
        verifyEncryption(password, user.password),
        chain(verified => (verified ? right(user) : left(invalidCredentials())))
      )
    ),
    fold(
      error => of(sendError(error, res)),
      user => of(sendAuth(user._id as ObjectID, res))
    )
  )();
});

export const registration = resolver(async (req: Req<User>, res) => {
  const { db } = req.app.locals;

  return await pipe(
    fromEither(validate(userDecoder, req.body)),
    chain(() => readOne(db, { email: req.body.email })),
    chain(user => (!user ? right(req.body) : left(e('User already exists', BAD_REQUEST)))),
    chain(user => encrypt(user.password)),
    chain(password => createOne(db, { ...req.body, password } as User)),
    map(write => parseWrite(write)),
    fold(
      error => of(sendError(error, res)),
      user => of(sendAuth(user._id as ObjectID, res))
    )
  )();
});

export const refresh = resolver(async (req, res) => {
  const { db } = req.app.locals;
  const cookie: string | null = req.cookies.ref;

  return await pipe(
    fromEither(isCookieNull(cookie)),
    chain(cookie => digestToken(cookie, db, String(REF_SECRET))),
    fold(
      error => of(res.status(error.status).json(failure({ token: null }))),
      user => of(sendAuth(user._id as ObjectID, res))
    )
  )();
});

export const logout = (_: Req<{}>, res: Response): Response =>
  pipe(res.clearCookie(COOKIE_NAME), res => res.status(OK).json(success()));
