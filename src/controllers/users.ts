import express from 'express';
import { path } from '../utils/path';
import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { success } from '../utils/success';
import { vdate } from '../middleware/vdate';
import { schema, SCHEMAS } from '../validators/users';
import { createUser } from '../services/createUser';
import * as P from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { hashPw } from '../services/hashPw';
import { createPw } from '../services/createPw';
import { cookie } from '../utils/cookie';
import { token } from '../utils/token';
import { e } from '../utils/e';
import { wrap } from '../utils/wrap';

const r = express.Router();
const p = path('/users');
const { USERS } = SCHEMAS;

r.post(
  p('/registration'),
  vdate(schema(USERS)),
  wrap(async (req, res, next) => {
    const { email, password } = req.body;
    const { db } = res.locals;

    // prepare an http response function
    const httpRes = (id: string): T.Task<void> => {
      res
        .cookie(...cookie(id))
        .status(OK)
        .json(success({ token: token(id) }));
      return T.of(undefined);
    };

    // prepare an http error function
    const httpErr = ({ message }: Error): T.Task<void> => {
      return T.of(next(e(message, INTERNAL_SERVER_ERROR)));
    };

    // business logic pipeline
    return await P.pipe(
      createUser({ db, email }),
      TE.chain(({ insertedId }) => hashPw({ email, password, _id: insertedId })),
      TE.chain(user => createPw({ db, user })),
      TE.fold(httpErr, httpRes)
    )();
  })
);

export default r;
