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

describe('post workout', () => {
  it('can post new workout', async () => {
    const res = await request(server)
      .post(p(''))
      .set('Authorization', `Bearer ${t}`)
      .send({
        date: 'Jan 01 2000',
        title: 'foo',
        notes: 'bar',
        exercises: [{ name: 'baz', weight: 100, sets: 100, reps: 100 }],
        tags: [{ color: '#4287f5', content: 'bar', _id: new ObjectId(), user: new ObjectId() }]
      });

    assert.ok(res.body.success);
    assert.ok(res.body.workout);
  });

  it('errors out if user cannot be authenticated', async () => {
    const res = await request(server)
      .post(p(''))
      .set('Authorization', 'foobar')
      .send({
        date: 'Jan 01 2000',
        title: 'foo',
        notes: 'bar',
        exercises: [{ name: 'baz', weight: 100, sets: 100, reps: 100 }],
        tags: [{ color: '#4287f5', content: 'bar', _id: new ObjectId(), user: new ObjectId() }]
      });

    assert.ok(!res.body.succcess);
    assert.equal(res.body.error, 'Unauthorized');
  });

  it('errors out if workout fails validation', async () => {
    const res = await request(server)
      .post(p(''))
      .set('Authorization', `Bearer ${t}`)
      .send({ date: 'Jan 01 2000' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid workout title - must be non-empty string');
  });
});
