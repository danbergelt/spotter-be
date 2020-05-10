import { Exercise } from 'src/controllers/exercises';
import { DAO } from 'src/index.types';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { badGateway } from 'src/utils/errors';
import { HTTPEither } from 'src/types';

const { EXERCISES } = COLLECTIONS;

export const readExercise = (db: DAO, { name, user }: Exercise): HTTPEither<Exercise | null> => {
  return tryCatch(async () => await db(EXERCISES).findOne({ name, user }), badGateway);
};
