import { request, use } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/express';
import { token } from '../../../utils/jwt';
import { ObjectId } from 'mongodb';
import assert from 'assert';

use(http);

const { TEST_ID } = process.env;

const exercisesPath = path('/exercises');
const t = token(new ObjectId(TEST_ID));

describe('delete exercise', () => {
  it('deletes an exercise', async () => {
    const { body } = await request(server)
      .post(exercisesPath(''))
      .set('Authorization', `Bearer ${t}`)
      .send({ name: 'exercise to delete' });
    const res = await request(server)
      .delete(exercisesPath(`/${body.exercise._id}`))
      .set('Authorization', `Bearer ${t}`);
    assert.ok(res.body.success);
    assert.ok(res.body.exercise);
  });

  it('errors out if user is not authenticated', async () => {
    const res = await request(server)
      .delete(exercisesPath('/foo'))
      .set('Authorization', `Bearer foo`);
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Unauthorized');
  });

  it('errors out if req param is not valid mongo id', async () => {
    const res = await request(server)
      .delete(exercisesPath('/foo'))
      .set('Authorization', `Bearer ${t}`);
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid resource id');
  });

  it('errors out if exercise does not exist', async () => {
    const res = await request(server)
      .delete(exercisesPath(`/${new ObjectId()}`))
      .set('Authorization', `Bearer ${t}`);
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Exercise not found');
  });
});
