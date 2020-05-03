import express from 'express';
import { path } from '../utils/path';
import { resolver } from '../utils/resolver';
import { CREATED } from 'http-status-codes';
import { success } from '../utils/httpResponses';
import { validate } from '../middleware/validate';
import { schema } from '../validators';
import { SCHEMAS } from '../utils/constants';
import { protect } from '../middleware/protect';
import { pipe } from 'fp-ts/lib/pipeable';
import { createWorkout } from '../services/createWorkout';
import { Req } from '../types';
import { fold } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { sendError } from '../utils/sendError';

const { WORKOUTS } = SCHEMAS;

const r = express.Router();
const workoutsPath = path('/workouts');

r.post(
  workoutsPath(''),
  protect(),
  validate(schema(WORKOUTS)),
  resolver(async ({ app, body }: Req<Workout>, res) => {
    const { db } = app.locals;
    const workout = body;

    return await pipe(
      createWorkout(db, workout),
      fold(
        error => of(sendError(error, res)),
        () => of(res.status(CREATED).json(success({ workout })))
      )
    )();
  })
);

export interface Workout {
  date: string;
  title: string;
  tags?: Array<{ color: string; content?: string }>;
  notes?: string;
  exercises: Array<{ name: string; weight?: number; sets?: number; reps?: number }>;
  user: string;
}

export default r;
