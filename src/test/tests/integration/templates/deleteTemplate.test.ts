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

describe('DELETE template by template id', () => {
  let tId: any;

  // create test user
  beforeEach(async () => {
    await Template.deleteMany({});
    const { _id } = await createUser();
    template.user = _id;
    const { _id: temp } = await createTemplate(template);
    tId = temp;
    return tId;
  });

  it('should delete template', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .delete(`/api/auth/templates/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.template.should.equal({ ...template, _id: tId });
        done();
      });
  });

  it('should not delete template with bad id', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .delete(`/api/auth/templates/12345`)
      .set('Authorization', `Bearer ${token}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(404);
        res.body.error.should.equal('Resource not found');
        done();
      });
  });

  it('should not delete template with bad token', done => {
    chai
      .request(app)
      .delete(`/api/auth/templates/${tId}`)
      .set('Authorization', `Bearer token`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Connection lost, try refreshing');
        done();
      });
  });

  it('should not delete template with no token', done => {
    chai
      .request(app)
      .delete(`/api/auth/templates/${tId}`)
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });
});
