import Workout from '../../models/Workout';

export const createWorkout = async (template: any) => {
  await Workout.deleteMany({});
  const workout = new Workout(template);
  return await workout.save();
};
