import assert from 'assert';
import { describe, beforeEach, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Workout from '../../../../models/Workout';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkout';

describe('Testing workout model deletion', () => {
  beforeEach(async () => await Workout.deleteMany({}));

  beforeEach(async () => {
    const { _id } = await createUser();
    template.user = _id;
  });

  it('removes a workout successfully', async () => {
    const workout = new Workout(template);
    await workout.save();
    await Workout.findOneAndDelete({ date: 'Jan 01' });
    const del = await Workout.findOne({ date: 'Jan 01' });
    assert(del === null);
  });

  it('removes a workout successfully by id', async () => {
    const workout = new Workout(template);
    await workout.save();
    await Workout.findByIdAndDelete(workout._id);
    const del = await Workout.findOne({ date: 'Jan 01' });
    assert(del === null);
  });
});
