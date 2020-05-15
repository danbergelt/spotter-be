import { resolver } from '../utils/resolver';
import { CREATED, BAD_REQUEST } from 'http-status-codes';
import { success } from '../utils/httpResponses';
import { pipe } from 'fp-ts/lib/pipeable';
import { authenticate } from '../services/authenticate';
import { validate } from '../services/validate';
import { schema } from '../validators';
import { SCHEMAS } from '../utils/constants';
import { chain, fold, left, right, map } from 'fp-ts/lib/TaskEither';
import { ObjectID } from 'mongodb';
import { createExercise } from '../services/createExercise';
import { Req } from '../types';
import { readExercise } from '../services/readExercise';
import { e } from '../utils/e';
import { of } from 'fp-ts/lib/Task';
import { sendError } from '../utils/sendError';
import { parseWrite } from '../utils/parseWrite';

const { EXERCISES } = SCHEMAS;

export const postExercise = resolver(async (req: Req<Exercise>, res) => {
  const { db } = req.app.locals;
  const exercise = req.body;

  return await pipe(
    authenticate(db, req),
    chain(ex => validate(schema(EXERCISES), ex)),
    chain(ex => readExercise(db, ex)),
    chain(ex => (!ex ? right(exercise) : left(e('Exercise already exists', BAD_REQUEST)))),
    chain(ex => createExercise(db, ex)),
    map(write => parseWrite<Exercise>(write)),
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
