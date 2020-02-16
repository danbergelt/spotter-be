const app = require('../../../utils/index');
import { genToken } from '../../../utils/genToken';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { template } from '../../../utils/templateWorkout';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
//@ts-ignore
const should = chai.should();
import { createUser } from '../../../utils/createUser';
import { createExercise } from '../../../utils/createExercise';
import Exercise from '../../../../models/Exercise';
import user from '../../../..//models/user';
import Workout from '../../../../models/Workout';

// configure Chai HTTP
chai.use(chaiHttp);

describe('PR functionality', () => {
  let uId: any;
  let eName: string;

  beforeEach(async () => {
    const { _id } = await createUser();
    uId = _id;
    const { name } = await createExercise(uId);
    eName = name;
  });

  afterEach(async () => {
    await user.deleteMany({});
    await Exercise.deleteMany({});
    await Workout.deleteMany({});
  });

  it('should post PR', async () => {
    const token = genToken(uId);
    await chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 999 }] });
    const updated = await Exercise.findOne({ name: eName });
    updated!.pr.should.equal(999);
  });

  it('should not post PR if not PR', async () => {
    const token = genToken(uId);
    await chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 999 }] });
    await chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 1 }] });
    const updated = await Exercise.findOne({ name: eName });
    updated!.pr.should.equal(999);
  });

  it('should post new PR and overwrite old PR', async () => {
    const token = genToken(uId);
    await chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 999 }] });
    await chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 1000 }] });
    const updated = await Exercise.findOne({ name: eName });
    updated!.pr.should.equal(1000);
  });

  it('should increase PR on workout edit', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 999 }] });
    await chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 1000 }] });
    await chai
      .request(app)
      .put(`/api/auth/workouts/${res.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 1001 }] });
    const updated = await Exercise.findOne({ name: eName });
    updated!.pr.should.equal(1001);
  });

  it('should decrease PR on workout edit', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 999 }] });
    await chai
      .request(app)
      .put(`/api/auth/workouts/${res.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 1 }] });
    const updated = await Exercise.findOne({ name: eName });
    updated!.pr.should.equal(1);
  });

  it('should remove pr on workout delete', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 1000 }] });
    await chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: eName, weight: 1 }] });
    await chai
      .request(app)
      .delete(`/api/auth/workouts/${res.body.data._id}`)
      .set('Authorization', `Bearer ${token}`);
    const updated = await Exercise.findOne({ name: eName });
    updated!.pr.should.equal(1);
  });

  describe('wrapper for PR functionality when editing exercises', () => {
    let uId2: any;
    beforeEach(async () => {
      const { _id } = await createUser();
      uId2 = _id;
    });

    it('adds the pr on pre-entered workouts and THEN an exercise is saved', async () => {
      const token = genToken(uId2);

      await chai
        .request(app)
        .post('/api/auth/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...template, exercises: [{ name: 'foo', weight: 1000 }] });

      const one = await Exercise.findOne({ name: 'foo' });
      chai.expect(one).to.equal(null);

      await chai
        .request(app)
        .post('/api/auth/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'foo' });

      const two = await Exercise.findOne({ name: 'foo' });
      chai.expect(two!.pr).to.equal(1000);
    });

    it('deletes the pr when exercise is deleted', async () => {
      const token = genToken(uId2);
      const res = await chai
        .request(app)
        .post('/api/auth/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'foo' });

      await chai
        .request(app)
        .post('/api/auth/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...template, exercises: [{ name: 'foo', weight: 1000 }] });

      const one = await Exercise.findOne({ name: 'foo' });
      chai.expect(one!.pr).to.equal(1000);

      await chai
        .request(app)
        .delete(`/api/auth/exercises/${res.body.exercise._id}`)
        .set('Authorization', `Bearer ${token}`);

      const two = await Exercise.findOne({ name: 'foo' });
      chai.expect(two).to.equal(null);
    });
  });
});
