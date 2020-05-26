import { Response } from 'express';
import { E, failure } from '../utils/parsers';
import { OK } from 'http-status-codes';
import { COOKIE_OPTIONS, COOKIE_NAME } from './constants';
import { success } from './parsers';
import { token } from './jwt';
import { of, Task } from 'fp-ts/lib/Task';

const { REF_SECRET, REF_EXPIRE, JWT_SECRET, JWT_EXPIRE } = process.env;

const refreshSecret = String(REF_SECRET);
const refreshExp = String(REF_EXPIRE);
const authSecret = String(JWT_SECRET);
const authExp = String(JWT_EXPIRE);

// http response that sends back a refresh token and an auth token
export const sendAuth = (id: number, res: Response): Task<Response> =>
  of(
    res
      .cookie(COOKIE_NAME, token(id, refreshSecret, refreshExp), COOKIE_OPTIONS)
      .status(OK)
      .json(success({ token: token(id, authSecret, authExp) }))
  );

// http error response
export const sendError = (res: Response) => ({ status, message }: E): Task<Response> =>
  of(res.status(status).json(failure({ error: message })));
