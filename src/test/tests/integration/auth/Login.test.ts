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

describe('Login existing user', () => {
  beforeEach(async () => await User.deleteMany({}));

  // Successful login
  it('should login existing user', done => {
    chai
      .request(app)
      .post('/api/auth/register')
      .send({ email: 'new@email.com', password: 'password' })
      .end(() =>
        chai
          .request(app)
          .post('/api/auth/login')
          .send({ email: 'new@email.com', password: 'password' })
          .set('Cookie', 'toll=paid')
          .end((_, res) => {
            chai.expect(res).to.have.cookie('toll');
            should.exist(res);
            res.body.success.should.equal(true);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            done();
          })
      );
  });

  // Bad login attempts
  it('should error out when email is not provided', done => {
    chai
      .request(app)
      .post('/api/auth/login')
      .send({ password: 'password' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.error.should.equal('Please provide an email and password');
        done();
      });
  });

  it('should error out when password is not provided', done => {
    chai
      .request(app)
      .post('/api/auth/login')
      .send({ email: 'test@email.com' })
      .end((_, res) => {
        should.exist(res);
        res.should.have.status(400);
        res.body.success.should.equal(false);
        res.body.should.be.a('object');
        res.body.error.should.equal('Please provide an email and password');
        done();
      });
  });

  it('should reject bad attempts', done => {
    chai
      .request(app)
      .post('/api/auth/login')
      .send({ email: 'test@email.com', password: 'password' })
      .end((_, res) => {
        should.exist(res);
        res.should.have.status(401);
        res.body.success.should.equal(false);
        res.body.should.be.a('object');
        res.body.error.should.equal('Invalid credentials');
        done();
      });
  });
});
