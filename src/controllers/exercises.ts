import { resolver } from '../utils/resolver';
import { CREATED, BAD_REQUEST } from 'http-status-codes';
import { success } from '../utils/httpResponses';
import { pipe } from 'fp-ts/lib/pipeable';
import { authenticate } from '../services/authenticate';
import { validate } from '../services/validate';
import { schema } from '../validators';
import { SCHEMAS } from '../utils/constants';
import { chain, fold, fromEither } from 'fp-ts/lib/TaskEither';
import { ObjectID } from 'mongodb';
import { createExercise } from '../services/createExercise';
import { Req } from '../types';
import { readExercise } from '../services/readExercise';
import { e } from '../utils/e';
import { of } from 'fp-ts/lib/Task';
import { sendError } from '../utils/sendError';
import { fromNullable } from 'fp-ts/lib/Either';

const { EXERCISES } = SCHEMAS;

// compositions
const isExerciseNull = fromNullable(e('Exercise already exists', BAD_REQUEST));

export const postExercise = resolver(async (req: Req<Exercise>, res) => {
  const { db } = req.app.locals;
  const exercise = req.body;

  return await pipe(
    authenticate(db, req),
    chain(ex => validate(schema(EXERCISES), ex)),
    chain(ex => readExercise(db, ex)),
    chain(ex => fromEither(isExerciseNull(ex))),
    chain(ex => createExercise(db, ex)),
    fold(
      error => of(sendError(error, res)),
      () => of(res.status(CREATED).json(success({ exercise })))
    )
  )();
});

export interface Exercise {
  name: string;
  user: ObjectID;
  pr?: number;
  prDate?: string;
}
