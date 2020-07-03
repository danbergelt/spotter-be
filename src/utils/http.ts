import { Response } from 'express';
import { E, failure } from '../utils/parsers';
import { OK } from 'http-status-codes';
import { COOKIE_OPTIONS, COOKIE_NAME } from './constants';
import { success } from './parsers';
import { tokenFactory } from './jwt';
import { Task, of } from 'fp-ts/lib/Task';

type Token = string;
type UserId = number;

const refreshSecret = String(process.env.REF_SECRET);
const refreshExp = String(process.env.REF_EXPIRE);
const authSecret = String(process.env.AUTH_SECRET);
const authExp = String(process.env.AUTH_EXPIRE);

type EncodeToken = (id: UserId) => Token;

const refreshToken: EncodeToken = id =>
  tokenFactory({ id, secret: refreshSecret, exp: refreshExp });

const authToken: EncodeToken = id =>
  tokenFactory({ id, secret: authSecret, exp: authExp });

// taskified http response that sends back a refresh token and an auth token
type SendAuth = (id: UserId, res: Response) => Task<Response>;
export const sendAuth: SendAuth = (id, res) =>
  of(
    res
      .cookie(COOKIE_NAME, refreshToken(id), COOKIE_OPTIONS)
      .status(OK)
      .json(success({ token: authToken(id) }))
  );

// taskified http error response
type SendError = (res: Response) => (e: E) => Task<Response>;
export const sendError: SendError = res => e =>
  of(res.status(e.status).json(failure({ error: e.message })));
