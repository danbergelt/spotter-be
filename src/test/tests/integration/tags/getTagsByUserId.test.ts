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

describe('GET tags by user id', () => {
  let uId: any;

  // Seed DB with max amount of tags
  beforeEach(async () => {
    await Tag.deleteMany({});
    const { _id } = await createUser();
    uId = _id;
    const insert = [];
    for (let i = 0; i < 25; i++) {
      insert.push({ color: 'red', content: `${i}`, user: uId });
    }
    await Tag.insertMany(insert);
    return uId;
  });

  it('should successfully fetch all tags for this user', done => {
    const token = genToken(uId);
    chai
      .request(app)
      .get('/api/auth/tags')
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.tags.length.should.equal(25);
        res.body.tags[0].user.should.equal(String(uId));
        done();
      });
  });

  it('should error out when no token is provided', done => {
    chai
      .request(app)
      .get('/api/auth/tags')
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should error out when bad token is provided', done => {
    chai
      .request(app)
      .get('/api/auth/tags')
      .set('Authorization', `Bearer token`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });
});
