import { ObjectID } from 'mongodb';
import { Response } from 'express';
import { OK } from 'http-status-codes';
import { cookie } from './cookie';
import jwt from 'jsonwebtoken';
import { COOKIE_OPTIONS } from './constants';
import { success } from './httpResponses';
import { token } from './token';

// http response that sends back a refresh token and an auth token

export const sendAuth = (_id: ObjectID, res: Response): Response => {
  return res
    .cookie(...cookie(_id, jwt, COOKIE_OPTIONS))
    .status(OK)
    .json(success({ token: token(_id) }));
};
