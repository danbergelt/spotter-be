import Exercise from '../../models/Exercise';
import Tag from '../../models/Tag';
import Template from '../../models/Template';
import User from '../../models/user';
import Workout from '../../models/Workout';

const wipe = async () => {
  await Exercise.deleteMany({});
  await Tag.deleteMany({});
  await Template.deleteMany({});
  await User.deleteMany({});
  await Workout.deleteMany({});
};

export default wipe;
