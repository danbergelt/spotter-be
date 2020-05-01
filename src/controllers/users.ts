import express from 'express';
import { path } from '../utils/path';
import { validate } from '../middleware/validate';
import { SCHEMAS, schema } from '../validators';
import { createUser } from '../services/createUser';
import { createPw } from '../services/createPw';
import { verifyJwt } from '../utils/verifyJwt';
import { resolver } from '../utils/resolver';
import { pipe } from 'fp-ts/lib/pipeable';
import { readUser } from '../services/readUser';
import { chain, fold, left, right, chainEitherK } from 'fp-ts/lib/TaskEither';
import { readPw } from '../services/readPw';
import { of } from 'fp-ts/lib/Task';
import { auth } from '../utils/auth';
import { Nullable, HTTPEither } from '../types';
import { ObjectId, ObjectID } from 'mongodb';
import { COOKIE_NAME } from '../utils/constants';
import { success } from '../utils/success';
import { OK } from 'http-status-codes';
import { _ } from '../utils/errors';
import { Req } from '../types';
import { Email, Password } from '../services/user.types';
import { failure } from 'src/utils/failure';

const { USERS } = SCHEMAS;

const r = express.Router();
export const usersPath = path('/users');

r.post(
  usersPath('/login'),
  validate(schema(USERS)),
  resolver(async (req: UserReq, res, next) => {
    const { email, password } = req.body;
    const { db } = req.app.locals;

    return await pipe(
      readUser(db, { email }),
      chain(user => readPw(db, { ...user, password })),
      fold(
        error => of(next(error)),
        _id => auth(_id, res)
      )
    )();
  })
);

r.post(
  usersPath('/registration'),
  validate(schema(USERS)),
  resolver(async (req: UserReq, res, next) => {
    const { email, password } = req.body;
    const { db } = req.app.locals;

    return await pipe(
      createUser(db, email),
      chain(({ insertedId }) => createPw(db, insertedId as ObjectID, password)),
      fold(
        error => of(next(error)),
        _id => auth(_id, res)
      )
    )();
  })
);

r.post(
  usersPath('/refresh'),
  resolver(async ({ cookies, app }, res) => {
    const { db } = app.locals;

    const refresh = cookies.ref as Nullable<string>;

    return await pipe(
      ((): HTTPEither<string> => (refresh ? right(refresh) : left(_())))(),
      chainEitherK(verifyJwt),
      chain(({ _id }) => readUser(db, { _id: new ObjectId(_id) })),
      fold(
        ({ status }) => {
          res.status(status).json(failure({ token: null }));
          return of(undefined);
        },
        ({ _id }) => auth(_id, res)
      )
    )();
  })
);

// eslint-disable-next-line
r.post(usersPath('/logout'), (_req, res, _next) => {
  pipe(res.clearCookie(COOKIE_NAME), res => res.status(OK).json(success()));
});

export type UserReq = Req<Pick<Email, 'email'> & Pick<Password, 'password'>>;

export default r;
