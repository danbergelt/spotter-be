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

  it('successfully fetches exercises', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .get(`/api/auth/exercises/`)
      .set('Authorization', `Bearer ${token}`);

    res.body.exercises[0].name.should.equal('name');
  });

  it('errors out with no token', async () => {
    const res = await chai.request(app).get(`/api/auth/exercises/`);

    res.body.error.should.equal('Access denied');
  });

  it('errors out with bad token', async () => {
    const res = await chai
      .request(app)
      .get(`/api/auth/exercises/`)
      .set('Authorization', `Bearer viorwfj`);

    res.body.error.should.equal('Connection lost, try refreshing');
  });
});
