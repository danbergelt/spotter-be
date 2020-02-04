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

describe('POST workouts by user id', () => {
  // create test user
  beforeEach(async () => {
    await Workout.deleteMany({});
    const { _id } = await createUser();
    template.user = _id;
  });

  it('should post workout', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send(template)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(201);
        res.body.data.user.should.equal(String(template.user!));
        res.body.data.date.should.equal(String(template.date));
        res.body.data.title.should.equal(String(template.title));
        res.body.data.notes.should.equal(String(template.notes));
        done();
      });
  });

  it('should not post workout with bad token', done => {
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer token`)
      .send(template)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Connection lost, try refreshing');
        done();
      });
  });

  it('should not post workout with no token', done => {
    chai
      .request(app)
      .post('/api/auth/workouts')
      .send(template)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should not post workout with no date', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, date: undefined })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('Please add a date for this workout');
        done();
      });
  });

  it('should not post workout with invalid date', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, date: 'Jan 01' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('Please add a valid date (Mmm DD YYYY)');
        done();
      });
  });

  it('should not post workout with no title', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, title: undefined })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('Please add a title');
        done();
      });
  });

  it('should not post workout with long title', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...template,
        title:
          'jfiowefjewiofjewiofjeiowfjeiowfjeiowfjeiowfjeiowfjeiowfjeiowfjewiofjeiowfjeiowfjeiowfjeiowfjewiofj'
      })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal(
          'Title cannot be longer than 25 characters'
        );
        done();
      });
  });

  it('trims title with white space', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, title: 'title   ' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(201);
        res.body.data.title.should.equal('title');
        done();
      });
  });

  it('should not post with undefined execise name', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, exercises: [{ name: undefined }] })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('Please add an exercise name');
        done();
      });
  });

  it('should not post with long execise name', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...template,
        exercises: [
          { name: 'jiouhjiohjiohjiohiuhguyguyguygyuguyguyguyuyguyguyuyg' }
        ]
      })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('25 character max');
        done();
      });
  });

  it('should not post weight above 2000', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...template,
        exercises: [{ name: 'name', weight: 2001 }]
      })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('2000 lb limit');
        done();
      });
  });

  it('should not post sets above 2000', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...template,
        exercises: [{ name: 'name', sets: 2001 }]
      })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('2000 sets limit');
        done();
      });
  });

  it('should not post reps above 2000', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .post('/api/auth/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...template,
        exercises: [{ name: 'name', reps: 2001 }]
      })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('2000 reps limit');
        done();
      });
  });
});
