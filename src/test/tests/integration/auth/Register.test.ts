const app = require('../../../utils/index');
import { describe, it } from 'mocha';
import User from '../../../../models/user';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
//@ts-ignore
const should = chai.should();

// configure Chai HTTP
chai.use(chaiHttp);

describe('Register new user', () => {
  beforeEach(async () => await User.deleteMany({}));

  // Successful registration --> POST/register
  it('should register new user', done => {
    chai
      .request(app)
      .post('/api/auth/register')
      .send({ email: 'test@email.com', password: 'password' })
      .set('Cookie', 'toll=paid')
      .end((_, res) => {
        should.exist(res);
        chai.expect(res).to.have.cookie('toll');
        res.body.success.should.equal(true);
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('token');
        done();
      });
  });

  // Invalid email errs
  it('cannot register w/ invalid email', done => {
    chai
      .request(app)
      .post('/api/auth/register')
      .send({ email: 'bad', password: 'password' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.error.should.equal('Please add a valid email');
        done();
      });
  });

  it('cannot register with no email', done => {
    chai
      .request(app)
      .post('/api/auth/register')
      .send({ password: 'password' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.error.should.equal('Please add an email');
        done();
      });
  });

  it('cannot create duplicates', async () => {
    const r = await chai
      .request(app)
      .post('/api/auth/register')
      .send({ email: 'test@email.com', password: 'password' });
    console.log(r.body.id);
    const res = await chai
      .request(app)
      .post('/api/auth/register')
      .send({ email: 'test@email.com', password: 'password' });
    should.exist(res);
    console.log(res.body.id);
    const users = await User.find({});
    console.log(users);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.error.should.equal('Duplicate detected, try again');
  });

  // Invalid password errs
  it('cannot register with no password', done => {
    chai
      .request(app)
      .post('/api/auth/register')
      .send({ email: 'test@email.com' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.error.should.equal('Please add a password');
        done();
      });
  });

  it('cannot register with password < 6 chars', done => {
    chai
      .request(app)
      .post('/api/auth/register')
      .send({ email: 'test@email.com', password: 'pass' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.error.should.equal(
          'Password needs to be at least 6 characters'
        );
        done();
      });
  });
});
