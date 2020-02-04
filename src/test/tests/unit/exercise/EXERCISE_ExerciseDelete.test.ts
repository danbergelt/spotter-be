import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Exercise from '../../../../models/Exercise';
import { createUser } from '../../../utils/createUser';

describe('Exercise model delete', () => {
  beforeEach(async () => await Exercise.deleteMany({}));

  it('can delete a saved exercise', async () => {
    const { _id } = await createUser();
    const exercise = new Exercise({
      name: 'exercise',
      user: _id
    });
    await exercise.save();
    await Exercise.findOneAndDelete({ name: 'exercise' });
    const fetched = await Exercise.findOne({ name: 'exercise ' });
    assert(fetched === null);
  });

  it('can delete a saved exercise by id', async () => {
    const { _id } = await createUser();
    const exercise = new Exercise({
      name: 'exercise',
      user: _id
    });
    await exercise.save();
    await Exercise.findByIdAndDelete(exercise._id);
    const fetched = await Exercise.findOne({ name: 'exercise' });
    assert(fetched === null);
  });
});
