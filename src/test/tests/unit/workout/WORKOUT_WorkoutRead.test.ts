import assert from 'assert';
import { describe, beforeEach, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Workout from '../../../../models/Workout';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkout';

describe('Workout model reading', () => {
  beforeEach(async () => await Workout.deleteMany({}));

  beforeEach(async () => {
    const { _id } = await createUser();
    template.user = _id;
  });

  // Successful user reading
  it('Successfully fetch workout', async () => {
    const workout = new Workout(template);
    await workout.save();
    const fetched = await Workout.findOne({ title: 'Workout' });
    //@ts-ignore
    assert(fetched.date === 'Jan 01 2020');
  });

  // Cannot fetch bad user details
  it('Cannot fetch workout', async () => {
    const fetched = await Workout.findOne({ title: 'Workout' });
    assert(fetched === null);
  });
});
