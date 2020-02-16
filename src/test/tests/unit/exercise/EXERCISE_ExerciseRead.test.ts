import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Exercise from '../../../../models/Exercise';
import { createUser } from '../../../utils/createUser';

describe('Exercise model read', () => {
  beforeEach(async () => await Exercise.deleteMany({}));

  it('can read a saved exercise', async () => {
    const { _id } = await createUser();
    const exercise = new Exercise({
      name: 'exercise',
      user: _id
    });
    await exercise.save();
    const fetched = await Exercise.findById(exercise._id);
    //@ts-ignore
    assert(fetched.name === 'exercise');
  });

  it('cannot fetch exercise', async () => {
    const fetched = await Exercise.findOne({ name: 'huh?' });
    assert(fetched === null);
  });
});
