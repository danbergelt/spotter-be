import express from 'express';
import { path } from '../utils/path';
import { resolver } from 'src/utils/resolver';
import { CREATED, BAD_REQUEST } from 'http-status-codes';
import { success } from 'src/utils/httpResponses';
import { pipe } from 'fp-ts/lib/pipeable';
import { auth } from 'src/services/auth';
import { validate } from 'src/services/validate';
import { schema } from 'src/validators';
import { SCHEMAS } from 'src/utils/constants';
import { chain, fold, fromEither } from 'fp-ts/lib/TaskEither';
import { ObjectID } from 'mongodb';
import { createExercise } from 'src/services/createExercise';
import { Req } from 'src/types';
import { readExercise } from 'src/services/readExercise';
import { e } from 'src/utils/e';
import { of } from 'fp-ts/lib/Task';
import { sendError } from 'src/utils/sendError';
import { fromNullable } from 'fp-ts/lib/Either';

const { EXERCISES } = SCHEMAS;

const r = express.Router();
const exercisesPath = path('/exercises');
const checkIfExerciseExists = fromNullable(e('Exercise already exists', BAD_REQUEST));

r.post(
  exercisesPath(''),
  resolver(async (req: Req<Exercise>, res) => {
    const { db } = req.app.locals;
    const exercise = req.body;

    return await pipe(
      auth(db, req),
      chain(ex => validate(schema(EXERCISES), ex)),
      chain(ex => readExercise(db, ex)),
      chain(ex => fromEither(checkIfExerciseExists(ex))),
      chain(ex => createExercise(db, ex)),
      fold(
        error => of(sendError(error, res)),
        () => of(res.status(CREATED).json(success({ exercise })))
      )
    )();
  })
);

export interface Exercise {
  name: string;
  user: ObjectID;
  pr?: number;
  prDate?: string;
}

export default r;
