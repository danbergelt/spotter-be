import express from 'express';
import { path } from '../utils/path';
import { OK } from 'http-status-codes';
import { success } from '../utils/success';
import { validate } from '../middleware/validate';
import { schema, SCHEMAS } from '../validators';
import { createUser } from '../services/createUser';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, fold } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { createPw } from '../services/createPw';
import { cookie } from '../utils/cookie';
import { token } from '../utils/token';
import { resolver } from '../utils/resolver';
import jwt from 'jsonwebtoken';
import { COOKIE_OPTIONS } from '../utils/constants';
import { readUser } from '../services/readUser';
import { readPw } from '../services/readPw';
import { UserBody } from './users.types';

const r = express.Router();
const userPath = path('/users');
const { USERS } = SCHEMAS;

r.post(
  userPath('/login'),
  validate(schema(USERS)),
  resolver(async (req: UserBody, res, next) => {
    const { email, password } = req.body;
    const { db } = req.app.locals;

    return pipe(
      readUser(db, email),
      chain(user => readPw(db, { ...user, password })),
      fold(
        error => of(next(error)),
        id => {
          res
            .cookie(...cookie(id, jwt, COOKIE_OPTIONS))
            .status(OK)
            .json(success({ token: token(id) }));
          return of(undefined);
        }
      )
    )();
  })
);

r.post(
  userPath('/registration'),
  validate(schema(USERS)),
  resolver(async (req, res, next) => {
    const { email, password } = req.body;
    const { db } = req.app.locals;

    return await pipe(
      createUser(db, email),
      chain(({ insertedId }) => createPw(db, insertedId, password)),
      fold(
        error => of(next(error)),
        id => {
          res
            .cookie(...cookie(id, jwt, COOKIE_OPTIONS))
            .status(OK)
            .json(success({ token: token(id) }));
          return of(undefined);
        }
      )
    )();
  })
);

export default r;
