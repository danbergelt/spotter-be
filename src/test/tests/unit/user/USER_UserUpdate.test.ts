import User from '../../../../models/user';
import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe('User model update', () => {
  beforeEach(async () => await User.deleteMany({}));

  // Successful user update
  it('updates a user successfully', async () => {
    const user = new User({ email: 'test@email.com', password: 'password' });
    await user.save();
    await User.findOneAndUpdate(
      { email: 'test@email.com' },
      { email: 'new@email.com' }
    );
    const foo = await User.findOne({ email: 'new@email.com' });
    assert(foo !== null);
  });

  it('updates a user successfully by id', async () => {
    const user = new User({ email: 'test@email.com', password: 'password' });
    await user.save();
    await User.findByIdAndUpdate(user._id, { email: 'blah@email.com' });
    const foo = await User.findOne({ email: 'blah@email.com' });
    assert(foo !== null);
  });

  // Bad update attempt
  it('cannot update email to invalid value', async () => {
    const user = new User({ email: 'test@email.com', password: 'password' });
    await user.save();
    await expect(
      User.findByIdAndUpdate(
        user._id,
        { email: 'blah' },
        { runValidators: true, context: 'query' }
      )
    ).to.be.rejectedWith('Please add a valid email');
  });
});
