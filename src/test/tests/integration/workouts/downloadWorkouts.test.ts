const app = require('../../../utils/index');
import assert from 'assert';
import { genToken } from '../../../utils/genToken';
import { describe, beforeEach, it } from 'mocha';
import { createWorkout } from '../../../utils/createWorkout';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const should = chai.should();
import Workout from '../../../../models/Workout';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkout';

/*

this test is throwing a [ERR_HTTP_HEADERS_SENT] error, even despite the fact that the test passes and QA passes as well

not sure what is causing this

*/

// configure Chai HTTP
chai.use(chaiHttp);

// binary parser --> allows the test to receive data
const binaryParser = function(res: any, cb: any) {
  res.setEncoding('binary');
  res.data = '';
  res.on('data', function(chunk: any) {
    res.data += chunk;
  });
  res.on('end', function() {
    cb(null, Buffer.from(res.data, 'binary'));
  });
};

describe('download workout data', () => {
  let uId: any;

  // create test user
  beforeEach(async () => {
    await Workout.deleteMany({});
    const { _id } = await createUser();
    template.user = _id;
    const { _id: temp } = await createWorkout(template);
    uId = temp;
    return uId;
  });

  it('should return download data', done => {
    const token = genToken(template.user!);
    chai
      .request(app)
      .get(`/api/auth/workouts/download`)
      .parse(binaryParser)
      .set('Authorization', `Bearer ${token}`)
      .buffer()
      .end((_, res) => {
        should.exist(res);
        res.status.should.equal(200);
        Buffer.isBuffer(res.body).should.equal(true);
        assert(res.body.toString().includes(uId));
        done();
      });
  });
});
