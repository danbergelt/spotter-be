import express from 'express';
import { path } from '../utils/path';
import { wrap } from '../utils/wrap';
import { ep } from '../utils/endpoints';
import { register } from '../services/users';

const r = express.Router();

const up = path('/users');

ep(r)(up('/registration'))('get')(wrap(register), (_, res) => {
  res.status(200).json({ success: true, message: 'sent' });
});

export default r;
