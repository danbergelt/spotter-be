import {
  buildListOfExercises,
  buildListOfPotentialPrs,
  updateExercisesWithPrs,
  buildHashTableOfPrs
} from './prs.functions';

export const prs = async (user: string): Promise<void> => {
  // build a list of saved exercise names for a specific user
  const exercises = await buildListOfExercises(user);

  // create a pool of data that could contains new prs
  const potentialPrs = await buildListOfPotentialPrs(user, exercises);

  // seed a hash table with confirmed prs
  const prs = buildHashTableOfPrs(exercises, potentialPrs);

  // update exercises with their new prs
  await updateExercisesWithPrs(user, prs);
};
