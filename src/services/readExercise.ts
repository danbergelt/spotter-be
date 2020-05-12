import { Exercise } from '../controllers/exercises';
import { DAO } from '../index.types';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { badGateway } from '../utils/errors';
import { HTTPEither } from '../types';

const { EXERCISES } = COLLECTIONS;

export const readExercise = (db: DAO, { name, user }: Exercise): HTTPEither<Exercise | null> => {
  return tryCatch(async () => await db(EXERCISES).findOne({ name, user }), badGateway);
};
