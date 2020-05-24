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
import { CREATED, NOT_FOUND, OK } from 'http-status-codes';
import { success, parseWrite, mongofy, parseDelete, e } from '../utils/parsers';
import { validate } from '../services/validate';
import { fromNullable } from 'fp-ts/lib/Either';

const { WORKOUTS } = COLLECTIONS;

const isWorkoutNull = fromNullable(e('Workout not found', NOT_FOUND));
const { createOne, deleteOne } = hooks<Workout>(WORKOUTS);
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

// delete a workout
export const deleteWorkout = resolver(async (req: Req, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(() => fromEither(mongofy(req.params.id))),
    chain(_id => pipe(deleteOne(db, { _id }), map(parseDelete))),
    chain(workout => fromEither(isWorkoutNull(workout))),
    fold(sendError(res), workout => of(res.status(OK).json(success({ workout }))))
  )();
});
