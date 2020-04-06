const app = require('../../../utils/index');
import { genToken } from '../../../utils/genToken';
import { describe, beforeEach, it } from 'mocha';
import { createWorkout } from '../../../utils/createWorkout';
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

describe('GET workouts by user id', () => {
  // create test user
  beforeEach(async () => {
    await Workout.deleteMany({});
    const { _id } = await createUser();
    template.user = _id;
    const insert = [];
    for (let i = 0; i < 15; i++) {
      insert.push(template);
    }
    await Workout.insertMany(insert);
  });

  it('should successfully fetch all workouts for this user', async () => {
    await createWorkout(template);
    const token = genToken(template.user!);
    const res = await chai
      .request(app)
      .get('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`);
    should.exist(res);
    res.body.success.should.equal(true);
    res.should.have.status(200);
    res.body.workouts[0].user.should.equal(String(template.user!));
    res.body.workouts[0].date.should.equal(String(template.date));
    res.body.workouts[0].title.should.equal(String(template.title));
    res.body.workouts[0].notes.should.equal(String(template.notes));
  });

  it('should error out when no token is provided', done => {
    chai
      .request(app)
      .get('/api/auth/workouts')
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should error out with incorrect token', done => {
    chai
      .request(app)
      .get('/api/auth/workouts')
      .set('Authorization', `Bearer token`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should return 10 workouts by default if content longer than 10', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .get('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.count.should.equal(10);
        done();
      });
  });

  it('should return 5 workouts on second page if content 15 elements long', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .get('/api/auth/workouts')
      .query({ page: '1' })
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.count.should.equal(5);
        done();
      });
  });

  it('should return 5 workouts if limit is 5', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .get('/api/auth/workouts')
      .query({ limit: '5' })
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.count.should.equal(5);
        done();
      });
  });
});
