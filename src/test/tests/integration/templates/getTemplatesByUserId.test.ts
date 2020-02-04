const app = require('../../../utils/index');
import { genToken } from '../../../utils/genToken';
import { describe, beforeEach, it } from 'mocha';
import { createTemplate } from '../../../utils/createTemplate';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const should = chai.should();
import Template from '../../../../models/Template';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkoutTemplate';

// configure Chai HTTP
chai.use(chaiHttp);

describe('GET templates by user Id', () => {
  // create test user
  beforeEach(async () => {
    await Template.deleteMany({});
    const { _id } = await createUser();
    template.user = _id;
    await createTemplate(template);
  });

  it('should get all templates for this user', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .get('/api/auth/templates')
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.templates[0].user.should.equal(String(template.user));
        res.body.templates[0].name.should.equal(String(template.name));
        res.body.templates[0].title.should.equal(String(template.title));
        res.body.templates[0].notes.should.equal(String(template.notes));
        done();
      });
  });

  it('should error out when no token is provided', done => {
    chai
      .request(app)
      .get('/api/auth/templates')
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
      .get('/api/auth/templates')
      .set('Authorization', `Bearer token`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Connection lost, try refreshing');
        done();
      });
  });
});
