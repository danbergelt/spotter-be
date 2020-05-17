import { tryCatch } from 'fp-ts/lib/TaskEither';
import { DAO } from '../index.types';
import { COLLECTIONS } from '../utils/constants';
import { badGateway } from '../utils/errors';
import { Workout } from '../controllers/workouts';
import { HTTPEither, Write, Saved } from '../types';

const { WORKOUTS } = COLLECTIONS;

type SW = Saved<Workout>;

export const createWorkout = (db: DAO, workout: Workout): HTTPEither<Write<SW>> => {
  return tryCatch(async () => await db(WORKOUTS).insertOne(workout), badGateway);
};
