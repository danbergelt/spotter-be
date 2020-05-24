import { request, use } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/express';
import { token } from '../../../utils/jwt';
import { ObjectId } from 'mongodb';
import assert from 'assert';

const p = path('/workouts');
const t = token(new ObjectId(process.env.TEST_ID));
use(http);

describe('put workout', () => {
  it('can put a workout', async () => {
    const { body } = await request(server)
      .post(p(''))
      .set('Authorization', `Bearer ${t}`)
      .send({ date: 'Jan 01 2000', title: 'foo' });

    const res = await request(server)
      .put(p(`/${body.workout._id}`))
      .set('Authorization', `Bearer ${t}`)
      .send({ date: 'Jan 02 1999', title: 'bar' });

    assert.ok(res.body.success);
    assert.ok(res.body.workout);
    assert.equal(res.body.workout.title, 'bar');
    assert.equal(res.body.workout.date, 'Jan 02 1999');
  });

  it('errors out if user cannot be authenticated', async () => {
    const res = await request(server).put(p('/foo'));
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Unauthorized');
  });

  it('errors out if body fails validation', async () => {
    const res = await request(server)
      .put(p(`/foo`))
      .set('Authorization', `Bearer ${t}`)
      .send({ foo: 'bar' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid date - must be non-empty string');
  });

  it('errors out with invalid resource id', async () => {
    const res = await request(server)
      .put(p('/foo'))
      .set('Authorization', `Bearer ${t}`)
      .send({ date: 'Jan 02 2000', title: 'foo' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid resource id');
  });

  it('errors out if resource does not exist', async () => {
    const res = await request(server)
      .put(p(`/${new ObjectId()}`))
      .set('Authorization', `Bearer ${t}`)
      .send({ date: 'Jan 02 2000', title: 'foo' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Workout not found');
  });
});
