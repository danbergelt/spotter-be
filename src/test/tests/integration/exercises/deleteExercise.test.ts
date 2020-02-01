const app = require('../../../utils/index');
import { genToken } from '../../../utils/genToken';
import { describe, beforeEach, it } from 'mocha';
import Exercise from '../../../../models/Exercise';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
//@ts-ignore
const should = chai.should();
import { createUser } from '../../../utils/createUser';
import { createExercise } from '../../../utils/createExercise';

// configure Chai HTTP
chai.use(chaiHttp);

describe('DELETE exercise by exercise id', () => {
  let uId: any;
  let eId: any;

  beforeEach(async () => {
    await Exercise.deleteMany({});
    const { _id } = await createUser();
    uId = _id;
    const { _id: temp } = await createExercise(_id);
    eId = temp;
    //@ts-ignore
    return uId, eId;
  });

  it('successfully deletes exercise', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .delete(`/api/auth/exercises/${eId}`)
      .set('Authorization', `Bearer ${token}`);

    res.body.data.should.equal('Exercise deleted');
  });

  it('should not delete exercise with bad id', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .delete(`/api/auth/exercises/dj9i12dj129`)
      .set('Authorization', `Bearer ${token}`);

    res.body.error.should.equal('Resource not found');
  });

  it('should not delete exercise with bad token', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/auth/exercises/${eId}`)
      .set('Authorization', `Bearer hjiouhjhj9uh9`);

    res.body.error.should.equal('Connection lost, try refreshing');
  });

  it('should not delete exercise with no token', async () => {
    const res = await chai.request(app).delete(`/api/auth/exercises/${eId}`);

    res.body.error.should.equal('Access denied');
  });
});
