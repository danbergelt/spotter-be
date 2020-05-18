import { Response } from 'express';
import { E, failure } from '../utils/parsers';
import { ObjectID } from 'mongodb';
import { OK } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { COOKIE_OPTIONS } from './constants';
import { success } from './parsers';
import { token, cookie } from './jwt';

// http response that sends back a refresh token and an auth token
export const sendAuth = (_id: ObjectID, res: Response): Response =>
  res
    .cookie(...cookie(_id, jwt, COOKIE_OPTIONS))
    .status(OK)
    .json(success({ token: token(_id) }));

// http error response
export const sendError = ({ status, message }: E, res: Response): Response =>
  res.status(status).json(failure({ error: message }));
