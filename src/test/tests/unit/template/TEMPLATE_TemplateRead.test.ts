import assert from 'assert';
import { describe, beforeEach, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Template from '../../../../models/Template';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkoutTemplate';

describe('template model fetch', () => {
  beforeEach(async () => await Template.deleteMany({}));

  beforeEach(async () => {
    const { _id } = await createUser();
    template.user = _id;
  });

  it('successfully fetch template', async () => {
    const temp = new Template(template);
    await temp.save();
    const fetched = await Template.findOne({ title: 'Workout' });
    //@ts-ignore
    assert(fetched.name === 'Test Template');
  });

  it('cannot fetch template', async () => {
    const fetched = await Template.findOne({ title: 'Workout' });
    assert(fetched === null);
  });
});
