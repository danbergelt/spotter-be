import { resolver } from '../utils/express';
import { CREATED, OK, NOT_FOUND } from 'http-status-codes';
import { pipe } from 'fp-ts/lib/pipeable';
import { authenticate } from '../services/authenticate';
import { validate } from '../services/validate';
import { COLLECTIONS } from '../utils/constants';
import { chain, fold, left, right, map, fromEither } from 'fp-ts/lib/TaskEither';
import { hooks } from '../services/hooks';
import { Req, RawExercise } from '../types';
import { e, parseWrite, parseDelete, success, mongofy } from '../utils/parsers';
import { of } from 'fp-ts/lib/Task';
import { sendError } from '../utils/http';
import { fromNullable } from 'fp-ts/lib/Either';
import { exerciseDecoder, Exercise } from '../validators/decoders';
import { duplicate } from '../utils/errors';

const { EXERCISES } = COLLECTIONS;

// compositions
const isExerciseNull = fromNullable(e('Exercise not found', NOT_FOUND));
const { readMany, deleteOne, readOne, createOne } = hooks<Exercise>(EXERCISES);
const decode = validate(exerciseDecoder);

// get all exercises for a specific user
export const readExercises = resolver(async (req: Req, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(user => readMany(db, user)),
    fold(sendError(res), exercises => of(res.status(OK).json(success({ exercises }))))
  )();
});

// delete an exercise by id
export const deleteExercise = resolver(async (req: Req, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(() => fromEither(mongofy(req.params.id))),
    chain(_id => pipe(deleteOne(db, { _id }), map(parseDelete))),
    chain(exercise => fromEither(isExerciseNull(exercise))),
    fold(sendError(res), exercise => of(res.status(OK).json(success({ exercise }))))
  )();
});

// create a new exercise
export const postExercise = resolver(async (req: Req<RawExercise>, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(ex => fromEither(decode(ex))),
    chain(ex =>
      pipe(
        readOne(db, ex),
        chain(dup => (dup ? left(duplicate('Exercise')) : right(ex)))
      )
    ),
    chain(ex => pipe(createOne(db, ex), map(parseWrite))),
    fold(sendError(res), exercise => of(res.status(CREATED).json(success({ exercise }))))
  )();
});
