import { tryCatch } from 'fp-ts/lib/TaskEither';
import { DAO } from '../index.types';
import { Exercise } from '../controllers/exercises';
import { COLLECTIONS } from '../utils/constants';
import { badGateway } from '../utils/errors';
import { HTTPEither, Write, Saved } from '../types';

const { EXERCISES } = COLLECTIONS;

type SE = Saved<Exercise>;

export const createExercise = (db: DAO, exercise: Exercise): HTTPEither<Write<SE>> => {
  return tryCatch(async () => await db(EXERCISES).insertOne(exercise), badGateway);
};
