import User from '../../../../models/user';
import assert from 'assert';
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe('User model reading', () => {
  beforeEach(async () => await User.deleteMany({}));

  // Successful user reading
  it('Successfully fetch user', async () => {
    const user = new User({ email: 'test@email.com', password: 'password' });
    await user.save();
    const fetched = await User.findOne({ email: 'test@email.com' });
    //@ts-ignore
    assert(fetched.email === 'test@email.com');
  });

  // Cannot fetch bad user details
  it('Cannot fetch user', async () => {
    const fetched = await User.findOne({ email: 'bad@email.com' });
    assert(fetched === null);
  });
});
