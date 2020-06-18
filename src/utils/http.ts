import { Response } from 'express';
import { E, failure } from '../utils/parsers';
import { OK } from 'http-status-codes';
import { COOKIE_OPTIONS, COOKIE_NAME } from './constants';
import { success } from './parsers';
import { token } from './jwt';
import { Task, of } from 'fp-ts/lib/Task';

type UserId = number;

const refreshSecret = String(process.env.REF_SECRET);
const refreshExp = String(process.env.REF_EXPIRE);
const authSecret = String(process.env.AUTH_SECRET);
const authExp = String(process.env.AUTH_EXPIRE);

// http response that sends back a refresh token and an auth token
export const sendAuth = (id: UserId, res: Response): Task<Response> =>
  of(
    res
      .cookie(COOKIE_NAME, token(id, refreshSecret, refreshExp), COOKIE_OPTIONS)
      .status(OK)
      .json(success({ token: token(id, authSecret, authExp) }))
  );

// http error response
export const sendError = (res: Response) => (e: E): Task<Response> =>
  of(res.status(e.status).json(failure({ error: e.message })));
