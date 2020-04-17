import express from 'express';
import { path } from '../utils/path';
import { wrap } from '../utils/wrap';
import { ep } from '../utils/endpoints';
import { register } from '../services/users';
import { OK } from 'http-status-codes';
import { success } from '../utils/success';

const r = express.Router();

const up = path('/users');

// register a new user

ep(r)(up('/registration'))('get')(wrap(register), (_, res) => {
  res.status(OK).json(success({ message: 'sent' }));
});

export default r;
