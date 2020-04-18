import express from 'express';
import { path } from '../utils/path';
import { wrap } from '../utils/wrap';
import { c } from '../utils/c';
import { register } from '../services/users';
import { OK } from 'http-status-codes';
import { success } from '../utils/success';
import { vdate } from '../middleware/vdate';
import { users } from '../validators/users';

const r = express.Router();

const up = path('/users');

// register a new user

c(r)(up('/registration'))('get')(vdate(users), wrap(register), (_, res) => {
  res.status(OK).json(success({ message: 'sent' }));
});

export default r;
