const app = require('../../../utils/index');
import { genToken } from '../../../utils/genToken';
import { describe, beforeEach, it } from 'mocha';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const should = chai.should();
import Tag from '../../../../models/Tag';
import { createUser } from '../../../utils/createUser';

// configure Chai HTTP
chai.use(chaiHttp);

describe('POST tag by user id', () => {
  let uId: any;

  // create test user
  beforeEach(async () => {
    await Tag.deleteMany({});
    const { _id } = await createUser();
    uId = _id;
    return uId;
  });

  it('should post tag', done => {
    const token = genToken(uId);
    chai
      .request(app)
      .post('/api/auth/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({ color: '#32a850', content: 'test', user: uId })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(201);
        res.body.tag.color.should.equal('#32a850');
        res.body.tag.content.should.equal('test');
        res.body.tag.user.should.equal(String(uId));
        done();
      });
  });

  it('should not post tag with bad token', done => {
    chai
      .request(app)
      .post('/api/auth/tags')
      .set('Authorization', `Bearer token`)
      .send({ color: '#32a850', content: 'test', user: uId })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should not post tag with no token', done => {
    chai
      .request(app)
      .post('/api/auth/tags')
      .send({ color: '#32a850', content: 'test', user: uId })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should not post tag with undefined color', done => {
    const token = genToken(uId);
    chai
      .request(app)
      .post('/api/auth/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({ color: undefined, content: 'test', user: uId })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('Invalid color detected');
        done();
      });
  });

  it('should not post tag with long content', done => {
    const token = genToken(uId);
    chai
      .request(app)
      .post('/api/auth/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({
        color: '#32a850',
        content: 'testjiojiojiojiojiojiojiojiojiojiojioj',
        user: uId
      })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('20 character max');
        done();
      });
  });

  describe('wrapper for testing custom duplicates check (no content)', () => {
    beforeEach(async () => {
      await Tag.deleteMany({});
      await Tag.create({ color: '#32a850', user: uId, content: '' });
    });

    it('should not post duplicate tag (no content)', done => {
      const token = genToken(uId);
      chai
        .request(app)
        .post('/api/auth/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ color: '#32a850', user: uId, content: '' })
        .end((_, res) => {
          should.exist(res);
          res.body.success.should.equal(false);
          res.should.have.status(400);
          res.body.error.should.equal('Tag already exists');
          done();
        });
    });

    it('can post tag with duplicate color and different content', done => {
      const token = genToken(uId);
      chai
        .request(app)
        .post('/api/auth/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ color: '#32a850', content: 'test', user: uId })
        .end((_, res) => {
          should.exist(res);
          res.body.success.should.equal(true);
          res.should.have.status(201);
          res.body.tag.user.should.equal(String(uId));
          done();
        });
    });
  });

  describe('wrapper for testing custom duplicates check (with content)', () => {
    beforeEach(async () => {
      await Tag.deleteMany({});
      await Tag.create({ color: '#32a850', content: 'test', user: uId });
    });

    it('should not post duplicate tag (with content)', done => {
      const token = genToken(uId);
      chai
        .request(app)
        .post('/api/auth/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ color: '#32a850', content: 'test', user: uId })
        .end((_, res) => {
          should.exist(res);
          res.body.success.should.equal(false);
          res.should.have.status(400);
          res.body.error.should.equal('Tag already exists');
          done();
        });
    });

    it('can post tag with duplicate color and different content', done => {
      const token = genToken(uId);
      chai
        .request(app)
        .post('/api/auth/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ color: '#32a850', content: 'test2', user: uId })
        .end((_, res) => {
          should.exist(res);
          res.body.success.should.equal(true);
          res.should.have.status(201);
          res.body.tag.user.should.equal(String(uId));
          done();
        });
    });

    it('can post tag with duplicate color and no content', done => {
      const token = genToken(uId);
      chai
        .request(app)
        .post('/api/auth/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ color: '#32a850', user: uId })
        .end((_, res) => {
          should.exist(res);
          res.body.success.should.equal(true);
          res.should.have.status(201);
          res.body.tag.user.should.equal(String(uId));
          done();
        });
    });

    it('can post tag with different color and duplicate content', done => {
      const token = genToken(uId);
      chai
        .request(app)
        .post('/api/auth/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ color: '#3432a8', content: 'test', user: uId })
        .end((_, res) => {
          should.exist(res);
          res.body.success.should.equal(true);
          res.should.have.status(201);
          res.body.tag.user.should.equal(String(uId));
          done();
        });
    });
  });

  describe('wrapper for testing collection size max', () => {
    // push 25 tags into collection (max size)
    beforeEach(async () => {
      const insert = [];
      for (let i = 0; i < 25; i++) {
        insert.push({ color: '#32a850', content: `${i}`, user: uId });
      }
      await Tag.insertMany(insert);
    });

    it('should not post tag when 25 tags already exist', done => {
      const token = genToken(uId);
      chai
        .request(app)
        .post('/api/auth/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ color: '#32a850', content: 'test', user: uId })
        .end((_, res) => {
          should.exist(res);
          res.body.success.should.equal(false);
          res.should.have.status(400);
          res.body.error.should.equal('25 tag maximum');
          done();
        });
    });
  });
});
