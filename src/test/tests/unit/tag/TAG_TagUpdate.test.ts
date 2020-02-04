import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Tag from '../../../../models/Tag';
import { createUser } from '../../../utils/createUser';

describe('Update tag model', () => {
  beforeEach(async () => await Tag.deleteMany({}));

  it('successfully updates tag model', async () => {
    const { _id } = await createUser();
    const tag = new Tag({ color: 'red', content: 'content', user: _id });
    await tag.save();
    await Tag.findByIdAndUpdate(tag._id, { color: 'blue', content: 'text' });
    const foo = await Tag.findOne({ color: 'blue' });
    assert(foo !== null);
  });

  it('cannot update tag color to undefined', async () => {
    const { _id } = await createUser();
    const tag = new Tag({ color: 'red', content: 'content', user: _id });
    await tag.save();
    await expect(
      Tag.findByIdAndUpdate(
        tag._id,
        { color: undefined, content: 'text' },
        { runValidators: true }
      )
    ).to.be.rejectedWith('Please add a tag color');
  });

  it('cannot update tag color to undefined', async () => {
    const { _id } = await createUser();
    const tag = new Tag({ color: 'red', content: 'content', user: _id });
    await tag.save();
    await expect(
      Tag.findByIdAndUpdate(
        tag._id,
        { color: 'red', content: 'hjiuhiugiugiugghiugiugiugiugiugiugiu' },
        { runValidators: true }
      )
    ).to.be.rejectedWith('20 character max');
  });
});
