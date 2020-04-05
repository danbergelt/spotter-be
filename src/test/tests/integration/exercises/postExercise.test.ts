const app = require('../../../utils/index');
import { genToken } from '../../../utils/genToken';
import { describe, beforeEach, it } from 'mocha';
import Exercise from '../../../../models/Exercise';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
//@ts-ignore
const should = chai.should();
import { createUser } from '../../../utils/createUser';

// configure Chai HTTP
chai.use(chaiHttp);

describe('POST exercise by user id', () => {
  let uId: any;

  // create test user
  beforeEach(async () => {
    await Exercise.deleteMany({});
    const { _id } = await createUser();
    uId = _id;
    return uId;
  });

  it('should post exercise', done => {
    const token = genToken(uId);
    chai
      .request(app)
      .post('/api/auth/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'name' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(201);
        res.body.exercise.name.should.equal('name');
        res.body.exercise.user.should.equal(String(uId));
        done();
      });
  });

  it('should not post exercise with bad token', done => {
    chai
      .request(app)
      .post('/api/auth/exercises')
      .set('Authorization', `Bearer token`)
      .send({ name: 'name' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should not post exercise with no token', done => {
    chai
      .request(app)
      .post('/api/auth/exercises')
      .send({ name: 'name' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should not post exercise when one already exists', async () => {
    const token = genToken(uId);
    await chai
      .request(app)
      .post('/api/auth/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'name' });

    const _ = await chai
      .request(app)
      .post('/api/auth/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'name' });

    _.body.error.should.equal('Exercise already exists');
  });

  it('should not post exercise with long exercise name', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .post('/api/auth/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'jiojiojiojiojiojiojiojiojiojiojiojiojiojioj' });

    res.body.error.should.equal('25 character max');
  });

  it('should not post exercise with no exercise name', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .post('/api/auth/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: undefined });

    res.body.error.should.equal('Please add an exercise name');
  });
});
