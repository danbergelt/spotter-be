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

describe('DELETE workout by workout id', () => {
  let uId: any;

  // create test user
  beforeEach(async () => {
    await Workout.deleteMany({});
    const { _id } = await createUser();
    template.user = _id;
    const { _id: temp } = await createWorkout(template);
    uId = temp;
    return uId;
  });

  it('should delete workout', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .delete(`/api/auth/workouts/${uId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.data.should.equal('Workout deleted');
        done();
      });
  });

  it('should not delete workout with bad id', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .delete(`/api/auth/workouts/12345`)
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(404);
        res.body.error.should.equal('Resource not found');
        done();
      });
  });

  it('should not delete workout with bad token', done => {
    chai
      .request(app)
      .delete(`/api/auth/workouts/${uId}`)
      .set('Authorization', `Bearer token`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Connection lost, try refreshing');
        done();
      });
  });

  it('should not delete workout with no token', done => {
    chai
      .request(app)
      .delete(`/api/auth/workouts/${uId}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });
});
