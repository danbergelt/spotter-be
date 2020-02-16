import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Tag from '../../../../models/Tag';
import { createUser } from '../../../utils/createUser';

describe('Tag model reading', () => {
  beforeEach(async () => await Tag.deleteMany({}));

  it('can read a saved tag model', async () => {
    const { _id } = await createUser();
    const tag = new Tag({ color: 'red', content: 'content', user: _id });
    await tag.save();
    const fetched = await Tag.findById(tag._id);
    //@ts-ignore
    assert(fetched.color === 'red');
  });

  it('cannot fetch tag', async () => {
    const fetched = await Tag.findOne({ color: 'huh?' });
    assert(fetched === null);
  });
});
