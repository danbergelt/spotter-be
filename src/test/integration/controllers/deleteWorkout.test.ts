import { request, use } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/express';
import { token } from '../../../utils/jwt';
import { ObjectId } from 'mongodb';
import assert from 'assert';

use(http);

const p = path('/workouts');
const t = token(new ObjectId(process.env.TEST_ID));

describe('can delete workout', () => {
  it('deletes a workout', async () => {
    const { body } = await request(server)
      .post(p(''))
      .set('Authorization', `Bearer ${t}`)
      .send({ date: 'Jan 01 2000', title: 'foo' });

    const res = await request(server)
      .delete(p(`/${body.workout._id}`))
      .set('Authorization', `Bearer ${t}`);

    assert.ok(res.body.success);
    assert.ok(res.body.workout);
  });

  it('cannot delete workout if user fails authentication', async () => {
    const res = await request(server)
      .delete(p('/foo'))
      .set('Authorization', 'foobar');
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Unauthorized');
  });

  it('cannot delete workout if invalid resource id', async () => {
    const res = await request(server)
      .delete(p('/foo'))
      .set('Authorization', `Bearer ${t}`);
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid resource id');
  });

  it('cannot delete workout if workout does not exist', async () => {
    const res = await request(server)
      .delete(p(`/${new ObjectId()}`))
      .set('Authorization', `Bearer ${t}`);

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Workout not found');
  });
});
