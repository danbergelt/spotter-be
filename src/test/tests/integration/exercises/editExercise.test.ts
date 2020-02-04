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

  it('successfully edits exercise', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put(`/api/auth/exercises/${eId}`)
      .send({ name: 'edited' })
      .set('Authorization', `Bearer ${token}`);

    res.body.exercise.name.should.equal('edited');
  });

  it('should not edit with bad id', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put(`/api/auth/exercises/jiojiojio`)
      .send({ name: 'edited' })
      .set('Authorization', `Bearer ${token}`);

    res.body.error.should.equal('Resource not found');
  });

  it('should not edit with bad token', async () => {
    const res = await chai
      .request(app)
      .put(`/api/auth/exercises/${eId}`)
      .send({ name: 'edited' })
      .set('Authorization', `Bearer jiouj`);

    res.body.error.should.equal('Connection lost, try refreshing');
  });

  it('should not edit with no token', async () => {
    const res = await chai
      .request(app)
      .put(`/api/auth/exercises/${eId}`)
      .send({ name: 'edited' });

    res.body.error.should.equal('Access denied');
  });

  it('should not change name to undefined', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put(`/api/auth/exercises/${eId}`)
      .send({ name: '' })
      .set('Authorization', `Bearer ${token}`);

    res.body.error.should.equal('Please add an exercise name');
  });

  it('should not change name to long name', async () => {
    const token = genToken(uId);
    const res = await chai
      .request(app)
      .put(`/api/auth/exercises/${eId}`)
      .send({
        name:
          'jiojiooijiojiojiojojojiojiojiojiojiojiojiojiojiojiojiojiojiojiojiojiojio'
      })
      .set('Authorization', `Bearer ${token}`);

    res.body.error.should.equal('25 character max');
  });
});
