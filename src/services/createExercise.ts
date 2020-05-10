import { tryCatch } from 'fp-ts/lib/TaskEither';
import { DAO } from 'src/index.types';
import { Exercise } from 'src/controllers/exercises';
import { COLLECTIONS } from '../utils/constants';
import { badGateway } from 'src/utils/errors';
import { HTTPEither, Write } from 'src/types';

const { EXERCISES } = COLLECTIONS;

export const createExercise = (db: DAO, exercise: Exercise): HTTPEither<Write> => {
  return tryCatch(async () => await db(EXERCISES).insertOne(exercise), badGateway);
};
