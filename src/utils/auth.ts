import { ObjectID } from 'mongodb';
import { Response } from 'express';
import { OK } from 'http-status-codes';
import { cookie } from './cookie';
import jwt from 'jsonwebtoken';
import { COOKIE_OPTIONS } from './constants';
import { success } from './success';
import { token } from './token';
import { of, Task } from 'fp-ts/lib/Task';

// http response that sends back a refresh token and an auth token

export const auth = (_id: string | ObjectID, res: Response): Task<void> => {
  res
    .cookie(...cookie(_id, jwt, COOKIE_OPTIONS))
    .status(OK)
    .json(success({ token: token(_id) }));
  return of(undefined);
};
