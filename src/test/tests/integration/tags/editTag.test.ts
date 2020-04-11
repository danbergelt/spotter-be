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

describe('PUT edit tag by tag id', () => {
  let uId: any;
  let tId: any;

  beforeEach(async () => {
    await Tag.deleteMany({});
    const { _id } = await createUser();
    uId = _id;
    const { _id: temp } = await createTag(_id);
    tId = temp;
    //@ts-ignore
    return uId, tId;
  });

  it('should edit tag', done => {
    const token = genToken(uId);
    chai
      .request(app)
      .put(`/api/auth/tags/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'EDITED' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.tag.content.should.equal('EDITED');
        done();
      });
  });

  it('should not edit tag with bad id', done => {
    const token = genToken(uId);
    chai
      .request(app)
      .put(`/api/auth/tags/12345`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'EDITED' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(404);
        res.body.error.should.equal('Resource not found (Cast error)');
        done();
      });
  });

  it('should not edit tag with bad token', done => {
    chai
      .request(app)
      .put(`/api/auth/workouts/${tId}`)
      .set('Authorization', `Bearer token`)
      .send({ content: 'EDITED' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should not edit tag with no token', done => {
    chai
      .request(app)
      .put(`/api/auth/tags/${uId}`)
      .send({ content: 'EDITED' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should not edit tag to long content', done => {
    const token = genToken(uId);
    chai
      .request(app)
      .put(`/api/auth/tags/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'jfeio2fjeio2fjeio2fjio2hohoihiohoi' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('20 character max');
        done();
      });
  });

  describe('cascade update wrapper', () => {
    beforeEach(async () => {
      await Tag.deleteMany({});
    });

    it('should cascade update tag in workout', async () => {
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
        .put(`/api/auth/tags/${tId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'EDITED' });
      const res = await chai
        .request(app)
        .get('/api/auth/workouts')
        .set('Authorization', `Bearer ${token}`);
      should.exist(res);
      res.body.success.should.equal(true);
      res.should.have.status(200);
      res.body.workouts[0].tags[0].content.should.equal('EDITED');
    });
    it('should cascade update tag in template', async () => {
      const token = genToken(uId);
      const tag = new Tag({ color: '#F2B202', content: 'content', user: uId });
      const { _id } = await tag.save();
      tId = _id;
      const temp = new Template({
        ...template,
        tags: { ...tag },
        user: uId,
        name: 'tname2'
      });
      await temp.save();
      await chai
        .request(app)
        .put(`/api/auth/tags/${tId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'EDITED' });
      const res = await chai
        .request(app)
        .get('/api/auth/templates')
        .set('Authorization', `Bearer ${token}`);
      should.exist(res);
      res.body.success.should.equal(true);
      res.should.have.status(200);
      res.body.templates[0].tags[0].content.should.equal('EDITED');
      await Template.deleteMany({});
    });
  });
});
