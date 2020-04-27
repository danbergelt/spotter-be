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
import { wrap } from '../utils/wrap';

const r = express.Router();
const userPath = path('/users');
const { USERS } = SCHEMAS;

r.post(
  userPath('/registration'),
  validate(schema(USERS)),
  wrap(async (req, res, next) => {
    const { email, password } = req.body;
    const { db } = req.app.locals;

    return await pipe(
      createUser(db, email),
      chain(({ insertedId }) => createPw(db, insertedId, password)),
      fold(
        error => of(next(error)),
        id => {
          res
            .cookie(...cookie(id))
            .status(OK)
            .json(success({ token: token(id) }));
          return of(undefined);
        }
      )
    )();
  })
);

export default r;
