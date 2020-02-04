import Exercise from '../../models/Exercise';

export const createExercise = async (id: string) => {
  await Exercise.deleteMany({});
  const exercise = new Exercise({ name: 'name', user: id });
  return await exercise.save();
};
