import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Exercise from '../../../../models/Exercise';
import { createUser } from '../../../utils/createUser';

describe('Exercise model creation', () => {
  beforeEach(async () => await Exercise.deleteMany({}));

  it('creates an exercise', async () => {
    const { _id } = await createUser();
    const exercise = new Exercise({
      name: 'exercise',
      user: _id
    });
    await exercise.save();
    assert(!exercise.isNew);
  });

  it('cannot create with no name', async () => {
    const { _id } = await createUser();
    const exercise = new Exercise({ user: _id });
    await expect(exercise.save()).to.be.rejectedWith(
      'Please add an exercise name'
    );
  });

  it('cannot create with long name', async () => {
    const { _id } = await createUser();
    const exercise = new Exercise({
      name:
        'fjweoifjwiofjiowfjiowfjiowfjiowjfiowjfiowjfiowfjiowjfiowjfwiofjwiofjwofj',
      user: _id
    });
    await expect(exercise.save()).to.be.rejectedWith('25 character max');
  });

  it('cannot create with no user', async () => {
    const exercise = new Exercise({
      name: 'name'
    });
    await expect(exercise.save()).to.be.rejectedWith('User validation failed');
  });
});
