import { resolver } from '../utils/express';
import { CREATED, BAD_REQUEST, OK, NOT_FOUND } from 'http-status-codes';
import { pipe } from 'fp-ts/lib/pipeable';
import { authenticate } from '../services/authenticate';
import { validate } from '../services/validate';
import { schema } from '../validators';
import { SCHEMAS, COLLECTIONS } from '../utils/constants';
import { chain, fold, left, right, map, fromEither } from 'fp-ts/lib/TaskEither';
import { hooks } from '../services/hooks';
import { Req, Owner } from '../types';
import { e, parseWrite, parseDelete, success, mongofy } from '../utils/parsers';
import { of } from 'fp-ts/lib/Task';
import { sendError } from '../utils/http';
import { fromNullable } from 'fp-ts/lib/Either';

const { EXERCISES } = SCHEMAS;

const isExerciseNull = fromNullable(e('Exercise not found', NOT_FOUND));
const { readMany, deleteOne, readOne, createOne } = hooks<Exercise>(COLLECTIONS.EXERCISES);

export const readExercises = resolver(async (req: Req<{}>, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(user => readMany(db, user)),
    fold(
      error => of(sendError(error, res)),
      exercises => of(res.status(OK).json(success({ exercises })))
    )
  )();
});

export const deleteExercise = resolver(async (req: Req<{}>, res) => {
  const { db } = req.app.locals;
  const { id } = req.params;

  return await pipe(
    authenticate(db, req),
    chain(() => fromEither(mongofy(id))),
    chain(_id => deleteOne(db, { _id })),
    map(del => parseDelete(del)),
    chain(exercise => fromEither(isExerciseNull(exercise))),
    fold(
      error => of(sendError(error, res)),
      exercise => of(res.status(OK).json(success({ exercise })))
    )
  )();
});

export const postExercise = resolver(async (req: Req<RawExercise>, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(ex => validate(schema(EXERCISES), ex)),
    chain(ex =>
      pipe(
        readOne(db, ex),
        chain(saved => (!saved ? right(ex) : left(e('Exercise already exists', BAD_REQUEST))))
      )
    ),
    chain(ex => createOne(db, ex)),
    map(write => parseWrite(write)),
    fold(
      error => of(sendError(error, res)),
      exercise => of(res.status(CREATED).json(success({ exercise })))
    )
  )();
});

export type RawExercise = {
  name: string;
  pr?: number;
  prDate?: string;
};

export type Exercise = RawExercise & Owner;
