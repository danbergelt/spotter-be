const app = require('../../../utils/index');
import { genToken } from '../../../utils/genToken';
import { describe, beforeEach, it } from 'mocha';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const should = chai.should();
import Workout from '../../../../models/Workout';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkout';
// configure Chai HTTP
chai.use(chaiHttp);

describe('GET workouts by date range and user id', () => {
  // create test user
  beforeEach(async () => {
    await Workout.deleteMany({});
    const { _id } = await createUser();
    template.user = _id;
    const insert = [];
    for (let i = 1; i < 10; i++) {
      insert.push({ ...template, date: `Jan 0${i} 2000` });
    }
    await Workout.insertMany(insert);
  });

  it('should successfully return specified range', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts/range')
      .set('Authorization', `Bearer ${token}`)
      .send({ range: ['Jan 01 2000', 'Jan 02 2000'] })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.count.should.equal(2);
        done();
      });
  });

  it('should fail with bad token', done => {
    chai
      .request(app)
      .post('/api/auth/workouts/range')
      .set('Authorization', `Bearer token`)
      .send({ range: ['Jan 01 2000', 'Jan 02 2000'] })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should fail with no token', done => {
    chai
      .request(app)
      .post('/api/auth/workouts/range')
      .send({ range: ['Jan 01 2000', 'Jan 02 2000'] })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should fail with no range', done => {
    const token = genToken(template.user!!);
    chai
      .request(app)
      .post('/api/auth/workouts/range')
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('Please supply a date range');
        done();
      });
  });

  it('should return empty array when no dates found', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts/range')
      .send({ range: ['Feb 28 2000', 'June 29 2000'] })
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.workouts.length.should.equal(0);
        done();
      });
  });
});
