import express from 'express';
import { path } from '../utils/path';
import { resolver } from '../utils/resolver';
import { OK } from 'http-status-codes';
import { success } from '../utils/httpResponses';
import { validate } from '../middleware/validate';
import { schema } from '../validators';
import { SCHEMAS } from '../utils/constants';
import { protect } from '../middleware/protect';

const { WORKOUTS } = SCHEMAS;

const r = express.Router();
const workoutsPath = path('/workouts');

r.post(
  workoutsPath(''),
  protect(),
  validate(schema(WORKOUTS)),
  resolver(async ({ app }, res, next) => {
    const { db } = app.locals;

    res.status(OK).json(success());
  })
);

export default r;
