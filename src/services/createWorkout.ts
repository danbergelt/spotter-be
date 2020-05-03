import { tryCatch } from 'fp-ts/lib/TaskEither';
import { DAO } from '../index.types';
import { COLLECTIONS } from '../utils/constants';
import { badGateway } from '../utils/errors';
import { Workout } from '../controllers/workouts';
import { HTTPEither, Write } from '../types';

const { WORKOUTS } = COLLECTIONS;

export const createWorkout = (db: DAO, workout: Workout): HTTPEither<Write> => {
  return tryCatch(async () => await db(WORKOUTS).insertOne(workout), badGateway);
};
