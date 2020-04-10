import { findMany, aggregate, updateOne } from './daos';
import Exercise from '../models/Exercise';
import Workout from '../models/Workout';
import { Pr, PrHashTable } from '../types';

/*== **IMPORTANT** =====================================================

All of the below functions are designed to be run inside of services
which are wrapped with an error handler. Thus,
no async functions at this level are caught.

*/

/*== buildListOfExercises =====================================================

A helper function that builds an array of strings that contain all of a saved
exercise's names for a certain user

*/

export const buildListOfExercises = async (
  user: string,
  findExercises = findMany,
  ExerciseModel = Exercise
): Promise<string[]> => {
  // find all exercises for the user
  const rawExercises = await findExercises(ExerciseModel, user);

  // reduce the raw exercises into an array of exercise names
  return rawExercises.reduce((acc, exercise) => {
    acc.push(exercise.name);
    return acc;
  }, [] as string[]);
};

/*== buildListOfPotentialPrs =====================================================

Aggregate a pool of data that contains potential new prs. Uses an aggregate call
to the DB to match workouts that contain saved exercises, and unwinds that data
into an array which we can iterate over and isolate prs.

*/

export const buildListOfPotentialPrs = async (
  user: string,
  exercises: string[],
  aggregatePrs = aggregate,
  WorkoutModel = Workout
): Promise<Pr[]> => {
  // match the user and completed exercises that are in the exercises array, i.e. saved exercises
  const $MATCH = {
    $match: { $and: [{ user }, { 'exercises.name': { $in: exercises } }] }
  };

  // unwind the array of exercises into individual objects
  const $UNWIND = { $unwind: '$exercises' };

  // return the exercises and the date (for saving the pr and prDate)
  const $PROJECT = { $project: { exercises: 1, date: 1 } };

  const STAGES = [$MATCH, $UNWIND, $PROJECT];

  // aggregate completed exercises from a user's workouts
  const prs: Pr[] = await aggregatePrs(WorkoutModel, STAGES);

  // filter out irrelevant exercises
  return prs.filter(pr => exercises.includes(pr.exercises.name));
};

/*== buildHashTableOfPrs =====================================================

Seed a hash table with Prs --> structured with exercise names as keys, and pr
weight and pr date in a tuple as values

*/

export const buildHashTableOfPrs = (
  exercises: string[],
  potentialPrs: Pr[]
): PrHashTable => {
  // instantiate a hash table to store prs
  const ht = {} as PrHashTable;

  // loop through saved exercises and seed hash table with base values
  exercises.forEach(exercise => (ht[exercise] = [0, undefined]));

  // loop through the potential prs and populate actual prs
  potentialPrs.forEach(potentialPr => {
    const { weight, name } = potentialPr.exercises;
    const { date } = potentialPr;
    if (name in ht && weight > ht[name][0]) ht[name] = [weight, date];
  });

  return ht;
};

/*== updateExercisesWithPrs =====================================================

Updates a user's saved exercises with respective prs

*/

export const updateExercisesWithPrs = async (
  user: string,
  ht: PrHashTable,
  updateExerciseWithPr = updateOne,
  ExerciseModel = Exercise
): Promise<void> => {
  // loop through the hash table, updating exercises with their prs
  for (const name in ht) {
    const FILTER = { user, name };
    const UPDATE = { pr: ht[name][0], prDate: ht[name][1] };
    await updateExerciseWithPr(ExerciseModel, FILTER, UPDATE);
  }
};
