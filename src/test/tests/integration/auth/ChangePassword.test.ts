const app = require('../../../utils/index');
import { genToken } from '../../../utils/genToken';
import { describe, beforeEach, it } from 'mocha';
import User from '../../../../models/user';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
//@ts-ignore
const should = chai.should();
import { createUser } from '../../../utils/createUser';

chai.use(chaiHttp);

describe('can change password', () => {
  let oldPass: any;
  let uId: any;

  // create test user
  beforeEach(async () => {
    await User.deleteMany({});
    const { _id } = await createUser();
    uId = _id;
    // Check for user
    //@ts-ignore
    const { password } = await User.findById(_id).select('+password');
    oldPass = password;
  });

  const getPassword = async () => {
    //@ts-ignore
    const { password } = await User.findById(uId).select('+password');
    return password;
  };

  it('should change password existing user', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put('/api/auth/user/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'password',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword'
      });
    should.exist(res);
    res.body.success.should.equal(true);
    res.should.have.status(200);
    const password = await getPassword();
    password.should.not.equal(oldPass);
  });

  it('should not change password with empty fields', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put('/api/auth/user/password')
      .set('Authorization', `Bearer ${token}`);
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('All fields are required');
  });

  it('should not change password with mismatch new password fields', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put('/api/auth/user/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'password',
        newPassword: 'newPassword',
        confirmPassword: 'fjwiofjwiof'
      });
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('New password fields must match');
  });

  it('should not change password with incorrect old password', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put('/api/auth/user/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'badpassword',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword'
      });
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('Invalid credentials');
  });
});
