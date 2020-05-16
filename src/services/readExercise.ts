import { Exercise } from '../controllers/exercises';
import { DAO } from '../index.types';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { badGateway } from '../utils/errors';
import { HTTPEither, Saved, Nullable } from '../types';

const { EXERCISES } = COLLECTIONS;

type SE = Saved<Exercise>;

export const readExercise = (db: DAO, exercise: Exercise): HTTPEither<Nullable<SE>> => {
  return tryCatch(async () => await db(EXERCISES).findOne(exercise), badGateway);
};
