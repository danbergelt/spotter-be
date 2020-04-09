import Exercise from '../models/Exercise';
import Workout from '../models/Workout';
import { Pr } from 'src/types';
import { findMany, aggregate, updateOne } from './daos';

export const prs = async (
  user: string,
  findExercises = findMany,
  aggregatePrs = aggregate,
  updateExercise = updateOne
): Promise<void> => {
  // find all exercises for the user
  const rawExercises = await findExercises(Exercise, user);

  // reduce the raw exercises into an array of exercise names
  const exercises = rawExercises.reduce((acc, exercise) => {
    acc.push(exercise.name);
    return acc;
  }, [] as string[]);

  // match the user and completed exercises that are in the exercises array, i.e. saved exercises
  const $MATCH = {
    $match: { $and: [{ user }, { 'exercises.name': { $in: exercises } }] }
  };

  // unwind the array of exercises into individual objects
  const $UNWIND = { $unwind: '$exercises' };

  // return the exercises and the date (for saving the pr and prDate)
  const $PROJECT = { $project: { exercises: 1, date: 1 } };

  // aggregate completed exercises from a user's workouts
  const prs: Pr[] = await aggregatePrs(Workout, [$MATCH, $UNWIND, $PROJECT]);

  // filter out irrelevant exercises
  const workouts = prs.filter(pr => exercises.includes(pr.exercises.name));

  // instantiate a hash table to store prs
  const ht = {} as Record<string, [number, string | undefined]>;

  // loop through saved exercises and seed hash table with base values
  exercises.forEach(exercise => (ht[exercise] = [0, undefined]));

  // loop through the modified workouts and populate prs
  workouts.forEach(workout => {
    const { weight, name } = workout.exercises;
    const { date } = workout;
    if (name in ht && weight > ht[name][0]) ht[name] = [weight, date];
  });

  // loop through the hash table, updating exercises with their prs
  for (const name in ht) {
    const FILTER = { user, name };
    const UPDATE = { pr: ht[name][0], prDate: ht[name][1] };
    await updateExercise(Exercise, FILTER, UPDATE);
  }
};
