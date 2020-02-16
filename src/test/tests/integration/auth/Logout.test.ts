const app = require('../../../utils/index');
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
//@ts-ignore
const should = chai.should();

// configure Chai HTTP
chai.use(chaiHttp);

describe('logout functionality', () => {
  it('should logout user and send proper message', done => {
    chai
      .request(app)
      .get('/api/auth/logout')
      .set('Cookie', 'toll=cookie')
      .end((_, res) => {
        should.exist(res);
        chai.expect(res).not.to.have.cookie('toll');
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.equal('Logged out');
        done();
      });
  });
});
