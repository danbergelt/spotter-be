import Exercise from '../models/Exercise';
import Workout from '../models/Workout';
import { WorkoutAggregate } from 'src/types';

export const prs = async (user: string): Promise<void> => {
  // find all exercises for the user
  const rawExercises = await Exercise.find({ user });

  // reduce the raw exercises into an array of exercise names
  const exercises = rawExercises.reduce((acc, exercise) => {
    acc.push(exercise.name);
    return acc;
  }, [] as string[]);

  // aggregate completed exercises from a user's workouts
  const rawWorkouts: WorkoutAggregate[] = await Workout.aggregate([
    // match the user and completed exercises that are in the exercises array, i.e. saved exercises
    {
      $match: { $and: [{ user }, { 'exercises.name': { $in: exercises } }] }
    },
    // unwind the array of exercises into individual objects
    { $unwind: '$exercises' },
    // return the exercises and the date (for saving the pr and prDate)
    { $project: { exercises: 1, date: 1 } }
  ]);

  // filter out irrelevant exercises
  // TODO --> get this working with Mongo using $filter
  const workouts = rawWorkouts.filter(r =>
    exercises.includes(r.exercises.name)
  );

  // instantiate a hash table to store prs
  const ht = {} as Record<string, [number, string | undefined]>;

  // loop through saved exercises and seed hash table with base values
  exercises.forEach(exercise => {
    ht[exercise] = [0, undefined];
  });

  // loop through the modified workouts and populate prs
  workouts.forEach(workout => {
    const { weight, name } = workout.exercises;
    const { date } = workout;
    if (name in ht && weight > ht[name][0]) ht[name] = [weight, date];
  });

  // loop through the hash table, updating exercises with their prs
  for (const name in ht) {
    await Exercise.findOneAndUpdate(
      { user, name },
      { pr: ht[name][0], prDate: ht[name][1] }
    );
  }
};
