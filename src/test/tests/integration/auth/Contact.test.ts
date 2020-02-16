const app = require('../../../utils/index');
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
//@ts-ignore
const should = chai.should();

chai.use(chaiHttp);

describe('send contact message', () => {
  it('sends successful contact message', async () => {
    const res = await chai
      .request(app)
      .post('/api/auth/contact')
      .send({
        name: 'foo',
        email: 'bar@email.com',
        subject: 'baz',
        message: 'qux'
      });
    should.exist(res);
    res.body.success.should.equal(true);
    res.should.have.status(200);
  });

  it('does not send with missing fields', async () => {
    const res = await chai
      .request(app)
      .post('/api/auth/contact')
      .send({
        name: 'foo',
        email: 'bar@email.com',
        subject: 'baz'
      });
    should.exist(res);
    res.body.success.should.equal(false);
    res.should.have.status(400);
    res.body.error.should.equal('All fields are required');

    const res1 = await chai
      .request(app)
      .post('/api/auth/contact')
      .send({
        name: 'foo',
        email: 'bar@email.com',
        message: 'qux'
      });
    should.exist(res);
    res1.body.success.should.equal(false);
    res1.should.have.status(400);
    res1.body.error.should.equal('All fields are required');

    const res2 = await chai
      .request(app)
      .post('/api/auth/contact')
      .send({
        name: 'foo',
        subject: 'baz',
        message: 'qux'
      });
    should.exist(res);
    res2.body.success.should.equal(false);
    res2.should.have.status(400);
    res2.body.error.should.equal('All fields are required');

    const res3 = await chai
      .request(app)
      .post('/api/auth/contact')
      .send({
        email: 'bar@email.com',
        subject: 'baz',
        message: 'qux'
      });
    should.exist(res);
    res3.body.success.should.equal(false);
    res3.should.have.status(400);
    res3.body.error.should.equal('All fields are required');
  });
});
