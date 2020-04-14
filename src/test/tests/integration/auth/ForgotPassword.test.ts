const app = require('../../../utils/index');
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createUser } from '../../../utils/createUser';
import User from '../../../../models/user';
chai.use(chaiAsPromised);
require('dotenv').config();
const should = chai.should();

// configure Chai HTTP
chai.use(chaiHttp);

after(() => {
  delete process.env.TESTING;
});

describe('Login existing user', () => {
  // Successful login
  it('should error out when no user found', async () => {
    const res = await chai
      .request(app)
      .post('/api/auth/user/forgotpassword')
      .send({ email: 'new@email.com' });
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(404);
    res.body.error.should.equal('User not found');
  });

  it('should send email', async () => {
    await createUser();
    const res = await chai
      .request(app)
      .post('/api/auth/user/forgotpassword')
      .send({ email: 'test@email.com' });
    should.exist(res);
    res.body.success.should.equal(true);
    res.should.have.status(200);
    await User.deleteMany({});
  });

  // CHANGE FORGOTTEN PASSWORD

  it('should error out when not all fields are present', async () => {
    const res = await chai
      .request(app)
      .put('/api/auth/user/forgotpassword/foo')
      .send({ newPassword: 'foo' });
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('All fields required');
  });

  it("should error out when fields don't match", async () => {
    const res = await chai
      .request(app)
      .put('/api/auth/user/forgotpassword/foo')
      .send({ newPassword: 'foo', confirmPassword: 'bar' });
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('New and confirm must match');
  });

  it('should error out with bad token', async () => {
    const res = await chai
      .request(app)
      .put('/api/auth/user/forgotpassword/foo')
      .send({ newPassword: 'foo', confirmPassword: 'foo' });
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('Invalid request');
  });

  it('password validation fails with short passwords', async () => {
    await createUser();
    const user = await User.findOne({ email: 'test@email.com' });
    const resetPasswordToken = user?.getResetPasswordToken();
    await user?.save({ validateBeforeSave: false });
    const res = await chai
      .request(app)
      .put(`/api/auth/user/forgotpassword/${resetPasswordToken}`)
      .send({ newPassword: 'foo', confirmPassword: 'foo' });
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('Password needs to be at least 6 characters');
    await User.deleteMany({});
  });

  it('can change forgotten password', async () => {
    await createUser();
    const user = await User.findOne({ email: 'test@email.com' });
    const resetPasswordToken = user?.getResetPasswordToken();
    await user?.save({ validateBeforeSave: false });
    const res = await chai
      .request(app)
      .put(`/api/auth/user/forgotpassword/${resetPasswordToken}`)
      .send({ newPassword: 'newpassword', confirmPassword: 'newpassword' });
    should.exist(res);
    res.body.success.should.equal(true);
    assert.isAbove(res.header['set-cookie'][0].split(/=|;/)[1].length, 0);
    res.should.have.status(200);
    res.body.should.have.property('token');
    await User.deleteMany({});
  });
});
