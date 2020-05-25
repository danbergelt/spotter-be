import { Response } from 'express';
import { E, failure } from '../utils/parsers';
import { OK } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { COOKIE_OPTIONS } from './constants';
import { success } from './parsers';
import { token, cookie } from './jwt';
import { of, Task } from 'fp-ts/lib/Task';

// http response that sends back a refresh token and an auth token
export const sendAuth = (id: number, res: Response): Task<Response> =>
  of(
    res
      .cookie(...cookie(id, jwt, COOKIE_OPTIONS))
      .status(OK)
      .json(success({ token: token(id) }))
  );

// http error response
export const sendError = (res: Response) => ({ status, message }: E): Task<Response> =>
  of(res.status(status).json(failure({ error: message })));
