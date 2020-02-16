import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Exercise from '../../../../models/Exercise';
import { createUser } from '../../../utils/createUser';

describe('Exercise model update', () => {
  beforeEach(async () => await Exercise.deleteMany({}));

  it('updates an exercise', async () => {
    const { _id } = await createUser();
    const exercise = new Exercise({
      name: 'exercise',
      user: _id
    });
    await exercise.save();
    await Exercise.findByIdAndUpdate(exercise._id, { name: 'newname' });
    const foo = await Exercise.findOne({ name: 'newname' });
    assert(foo !== null);
  });

  it('cannot update an exercise to no name', async () => {
    const { _id } = await createUser();
    const exercise = new Exercise({
      name: 'exercise',
      user: _id
    });
    await exercise.save();
    await expect(
      Exercise.findByIdAndUpdate(
        exercise._id,
        { name: undefined },
        { runValidators: true }
      )
    ).to.be.rejectedWith('Please add an exercise name');
  });

  it('cannot update an exercise to long name', async () => {
    const { _id } = await createUser();
    const exercise = new Exercise({
      name: 'exercise',
      user: _id
    });
    await exercise.save();
    await expect(
      Exercise.findByIdAndUpdate(
        exercise._id,
        {
          name:
            'fjwiofjwiofjwiofjwhbvuyvfgyehughehrguyiwfhwofjpfjpqfjpfjdncveivbeiugvwibvwicwoij'
        },
        { runValidators: true }
      )
    ).to.be.rejectedWith('25 character max');
  });
});
