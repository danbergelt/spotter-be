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

describe('change email', () => {
  let oldEmail: any;
  let uId: any;

  // create test user
  beforeEach(async () => {
    await User.deleteMany({});
    const { _id } = await createUser();
    uId = _id;
    // Check for user
    //@ts-ignore
    const { email } = await User.findById(uId);
    oldEmail = email;
  });

  const getEmail = async () => {
    //@ts-ignore
    const { email } = await User.findById(uId);
    return email;
  };

  it('should change email for existing user', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put('/api/auth/user/email')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldEmail: 'test@email.com',
        newEmail: 'new@email.com',
        confirmEmail: 'new@email.com'
      });
    should.exist(res);
    res.body.success.should.equal(true);
    res.should.have.status(200);
    const email = await getEmail();
    email.should.not.equal(oldEmail);
    email.should.equal('new@email.com');
  });

  it('should not change email with empty fields', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put('/api/auth/user/email')
      .set('Authorization', `Bearer ${token}`);
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('All fields are required');
  });

  it('should not change email with mismatch new email fields', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put('/api/auth/user/email')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldEmail: 'test@email.com',
        newEmail: 'new@email.com',
        confirmEmail: 'badnew@email.com'
      });
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('New email fields must match');
  });

  it('should not change email with incorrect old email', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put('/api/auth/user/email')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldEmail: 'badtest@email.com',
        newEmail: 'new@email.com',
        confirmEmail: 'new@email.com'
      });
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('Invalid credentials');
  });
});
