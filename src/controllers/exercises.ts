import { resolver } from '../utils/resolver';
import { CREATED, BAD_REQUEST, OK, NOT_FOUND } from 'http-status-codes';
import { success } from '../utils/httpResponses';
import { pipe } from 'fp-ts/lib/pipeable';
import { authenticate } from '../services/authenticate';
import { validate } from '../services/validate';
import { schema } from '../validators';
import { SCHEMAS, COLLECTIONS } from '../utils/constants';
import { chain, fold, left, right, map, fromEither } from 'fp-ts/lib/TaskEither';
import { ObjectID } from 'mongodb';
import { hooks } from '../services/hooks';
import { Req } from '../types';
import { e } from '../utils/e';
import { of } from 'fp-ts/lib/Task';
import { sendError } from '../utils/sendError';
import { parseWrite } from '../utils/parseWrite';
import { parseDelete } from '../utils/parseDelete';
import { mongofy } from '../utils/mongofy';
import { fromNullable } from 'fp-ts/lib/Either';

const { EXERCISES } = SCHEMAS;

const isExerciseNull = fromNullable(e('Exercise not found', NOT_FOUND));
const { readMany, deleteOne, readOne, createOne } = hooks<Exercise>(COLLECTIONS.EXERCISES);

export const readExercises = resolver(async (req, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(({ user }) => fromEither(mongofy(user))),
    chain(user => readMany(db, { user })),
    fold(
      error => of(sendError(error, res)),
      exercises => of(res.status(OK).json(success({ exercises })))
    )
  )();
});

export const deleteExercise = resolver(async (req, res) => {
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

export const postExercise = resolver(async (req: Req<Exercise>, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(ex => validate(schema(EXERCISES), ex)),
    chain(ex =>
      pipe(
        readOne(db, ex),
        chain(savedEx => (!savedEx ? right(ex) : left(e('Exercise already exists', BAD_REQUEST))))
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

export interface Exercise {
  name: string;
  user: ObjectID;
  pr?: number;
  prDate?: string;
}
