import { tryCatch } from 'fp-ts/lib/TaskEither';
import { DAO } from 'src/index.types';
import { COLLECTIONS } from '../utils/constants';
import { badGateway } from '../utils/errors';
import { HTTPEither, Del, Saved } from '../types';
import { Exercise } from 'src/controllers/exercises';

const { EXERCISES } = COLLECTIONS;

type SE = Saved<Exercise>;

export const deleteExercise = (db: DAO, exercise: Partial<SE>): HTTPEither<Del<SE>> => {
  return tryCatch(async () => db(EXERCISES).findOneAndDelete(exercise), badGateway);
};
