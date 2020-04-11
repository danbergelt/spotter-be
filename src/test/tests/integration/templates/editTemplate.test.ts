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

describe('PUT edit template by template id', () => {
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

  it('should edit template', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'EDITED' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.data.title.should.equal('EDITED');
        done();
      });
  });

  it('should not edit template with bad id', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/jioj89j9`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'EDITED' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(404);
        res.body.error.should.equal('Resource not found (Cast error)');
        done();
      });
  });

  it('should not edit template with bad token', done => {
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
      .set('Authorization', `Bearer jiojiojio`)
      .send({ title: 'EDITED' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should not edit template with no token', done => {
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
      .send({ title: 'EDITED' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(401);
        res.body.error.should.equal('Access denied');
        done();
      });
  });

  it('should not edit template to no name', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('Give your template a name');
        done();
      });
  });

  it('should not edit template to long name', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'jiojiojiojiojiojfiwojfeiowfjeiowfjeiowfjwefewfwcqcxwxm,opocj'
      })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('20 character max');
        done();
      });
  });

  it('should not put template with long title', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
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
      .put(`/api/auth/templates/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...template, title: 'edited title   ' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.data.title.should.equal('edited title');
        done();
      });
  });

  it('trims name with white space', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'edited name                        ' })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(true);
        res.should.have.status(200);
        res.body.data.name.should.equal('edited name');
        done();
      });
  });

  it('should not put long exercise name', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        exercises: {
          name: 'fjwiofjiowfjeiowfjeiowfjeiowfjeiwofjeiowfjeiowfjeiowfjwio'
        }
      })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('25 character max');
        done();
      });
  });

  it('should not put blank exercise name', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        exercises: {
          name: undefined
        }
      })
      .end((_, res) => {
        should.exist(res);
        res.body.success.should.equal(false);
        res.should.have.status(400);
        res.body.error.should.equal('Please add an exercise name');
        done();
      });
  });

  it('should not put weight above 2000', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
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

  it('should not put sets above 2000', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
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

  it('should not put reps above 2000', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .put(`/api/auth/templates/${tId}`)
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
