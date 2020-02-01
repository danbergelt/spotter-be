import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Tag from '../../../../models/Tag';
import { createUser } from '../../../utils/createUser';

describe('Tag model deletion', () => {
  beforeEach(async () => await Tag.deleteMany({}));

  it('removes a tag successfully', async () => {
    const { _id } = await createUser();
    const tag = new Tag({ color: 'red', content: 'content', user: _id });
    await tag.save();
    await Tag.findOneAndDelete({ color: 'red' });
    const del = await Tag.findOne({ color: 'red' });
    assert(del === null);
  });

  it('removes a tag by id successfully', async () => {
    const { _id } = await createUser();
    const tag = new Tag({ color: 'red', content: 'content', user: _id });
    await tag.save();
    await Tag.findByIdAndDelete(tag._id);
    const del = await Tag.findOne({ color: 'red' });
    assert(del === null);
  });
});
