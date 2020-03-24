const app = require('../../../utils/index');
import { genToken } from '../../../utils/genToken';
import { describe, beforeEach, it } from 'mocha';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const should = chai.should();
import Tag from '../../../../models/Tag';
import Workout from '../../../../models/Workout';
import Template from '../../../../models/Template';
import { createUser } from '../../../utils/createUser';
import { createTag } from '../../../utils/createTag';
import { template } from '../../../utils/templateWorkout';

// configure Chai HTTP
chai.use(chaiHttp);

describe('DELETE Tag by tag id', () => {
  let uId: any;
  let tId: any;

  beforeEach(async () => {
    await Tag.deleteMany({});
    const { _id } = await createUser();
    uId = _id;
    const { _id: temp } = await createTag(_id);
    tId = temp;
  });

  it('successfully deletes tag', done => {
    const token = genToken(uId);
    chai
      .request(app)
      .delete(`/api/auth/tags/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.tag._id.should.equal(String(tId));
        done();
      });
  });

  it('should not delete tag with bad id', done => {
    const token = genToken(uId);
    chai
      .request(app)
      .delete(`/api/auth/tags/123456`)
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(404);
        res.body.error.should.equal('Resource not found');
        done();
      });
  });

  it('should not delete tag with bad token', done => {
    chai
      .request(app)
      .delete(`/api/auth/tags/${uId}`)
      .set('Authorization', `Bearer token`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Connection lost, try refreshing');
        done();
      });
  });

  it('should not delete tag with no token', done => {
    chai
      .request(app)
      .delete(`/api/auth/tags/${uId}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  describe('cascade delete wrapper', () => {
    beforeEach(async () => {
      await Tag.deleteMany({});
    });

    it('should cascade delete tag from workout', async () => {
      const token = genToken(uId);
      const tag = new Tag({ color: '#F2B202', content: 'content', user: uId });
      const { _id } = await tag.save();
      tId = _id;
      const workout = new Workout({
        ...template,
        tags: { ...tag },
        user: uId
      });
      await workout.save();
      await chai
        .request(app)
        .delete(`/api/auth/tags/${tId}`)
        .set('Authorization', `Bearer ${token}`);
      const res = await chai
        .request(app)
        .get('/api/auth/workouts')
        .set('Authorization', `Bearer ${token}`);
      should.exist(res);
      res.body.success.should.equal(true);
      res.should.have.status(200);
      res.body.workouts[0].tags.length.should.equal(0);
    });
    it('should cascade delete tag from template', async () => {
      const token = genToken(uId);
      const tag = new Tag({ color: '#F2B202', content: 'content', user: uId });
      const { _id } = await tag.save();
      tId = _id;
      const temp = new Template({
        ...template,
        tags: { ...tag },
        user: uId,
        name: 'tnamguyguyguye'
      });
      await temp.save();
      await chai
        .request(app)
        .delete(`/api/auth/tags/${tId}`)
        .set('Authorization', `Bearer ${token}`);
      const res = await chai
        .request(app)
        .get('/api/auth/templates')
        .set('Authorization', `Bearer ${token}`);
      should.exist(res);
      res.body.success.should.equal(true);
      res.should.have.status(200);
      res.body.templates[0].tags.length.should.equal(0);
      await Template.deleteMany({});
    });
  });
});
