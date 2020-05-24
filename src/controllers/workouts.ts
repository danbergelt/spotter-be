import { resolver } from '../utils/express';
import { Req, RawWorkout } from '../types';
import { authenticate } from '../services/authenticate';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, fold, fromEither, map } from 'fp-ts/lib/TaskEither';
import { hooks } from '../services/hooks';
import { Workout, workoutDecoder } from '../validators/decoders';
import { COLLECTIONS } from '../utils/constants';
import { sendError } from '../utils/http';
import { of } from 'fp-ts/lib/Task';
import { CREATED } from 'http-status-codes';
import { success, parseWrite } from '../utils/parsers';
import { validate } from '../services/validate';

const { WORKOUTS } = COLLECTIONS;

const { createOne } = hooks<Workout>(WORKOUTS);
const decoder = validate(workoutDecoder);

// create a new workout
export const postWorkout = resolver(async (req: Req<RawWorkout>, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(workout => fromEither(decoder(workout))),
    chain(workout => pipe(createOne(db, workout), map(parseWrite))),
    fold(sendError(res), workout => of(res.status(CREATED).json(success({ workout }))))
  )();
});
