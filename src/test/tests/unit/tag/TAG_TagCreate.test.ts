import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Tag from '../../../../models/Tag';
import { createUser } from '../../../utils/createUser';

describe('Tag model creation', () => {
  beforeEach(async () => await Tag.deleteMany({}));

  // Successful tag creation
  it('creates a workout tag', async () => {
    const { _id } = await createUser();
    const tag = new Tag({ color: 'red', content: 'content', user: _id });
    await tag.save();
    assert(!tag.isNew);
  });

  it('cannot create with no tag color', async () => {
    const { _id } = await createUser();
    const tag = new Tag({ color: undefined, content: 'content', user: _id });
    await expect(tag.save()).to.be.rejectedWith('Please add a tag color');
  });

  it('cannot create with long tag content', async () => {
    const { _id } = await createUser();
    const tag = new Tag({
      color: 'red',
      content: 'hiohjiojiojfwiojfeiowfjeiowfjwiofjeiowfj',
      user: _id
    });
    await expect(tag.save()).to.be.rejectedWith('20 character max');
  });

  it('cannot create with no user', async () => {
    const tag = new Tag({ color: 'red', content: 'content', user: undefined });
    await expect(tag.save()).to.be.rejectedWith(Error);
  });
});
