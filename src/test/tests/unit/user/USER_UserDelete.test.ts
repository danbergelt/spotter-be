import User from '../../../../models/user';
import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe('User model deletion', () => {
  beforeEach(async () => await User.deleteMany({}));

  // Successful user deletion
  it('removes a user successfully', async () => {
    const user = new User({ email: 'test@email.com', password: 'password' });
    await user.save();
    await User.findOneAndDelete({ email: 'test@email.com' });
    const del = await User.findOne({ email: 'test@email.com' });
    assert(del === null);
  });

  it('removes a user successfully by id', async () => {
    const user = new User({ email: 'test@email.com', password: 'password' });
    await user.save();
    await User.findByIdAndDelete(user._id);
    const del = await User.findOne({ email: 'test@email.com' });
    assert(del === null);
  });
});
