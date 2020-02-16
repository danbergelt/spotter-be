import assert from 'assert';
import { describe, beforeEach, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Template from '../../../../models/Template';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkoutTemplate';

describe('template model deletion', () => {
  beforeEach(async () => await Template.deleteMany({}));

  beforeEach(async () => {
    const { _id } = await createUser();
    template.user = _id;
  });

  it('removes a template successfully', async () => {
    const temp = new Template(template);
    await temp.save();
    await Template.findOneAndDelete({ name: 'Test Template' });
    const del = await Template.findOne({ name: 'Test Template' });
    assert(del === null);
  });

  it('removes a template successfully by id', async () => {
    const temp = new Template(template);
    await temp.save();
    await Template.findByIdAndDelete(temp._id);
    const del = await Template.findOne({ name: 'Test Template' });
    assert(del === null);
  });
});
