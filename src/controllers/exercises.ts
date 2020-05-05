import express from 'express';
import { path } from '../utils/path';
import { resolver } from 'src/utils/resolver';
import { CREATED } from 'http-status-codes';
import { success } from 'src/utils/httpResponses';

const r = express.Router();
const exercisesPath = path('/exercises');

r.post(
  exercisesPath(''),
  resolver(async (req, res, next) => {
    res.status(CREATED).json(success());
  })
);

export default r;
