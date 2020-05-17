import server from '../../../index';
import { use, request } from 'chai';
import http from 'chai-http';
import { path } from '../../../utils/path';
import { token } from '../../../utils/token';
import { ObjectId } from 'mongodb';
import assert from 'assert';

const { TEST_ID } = process.env;

use(http);

const p = path('/exercises')('');
const t = token(new ObjectId(TEST_ID));

describe('post exercise', () => {
  it('creates a new exercise', async () => {
    const res = await request(server)
      .post(p)
      .set('Authorization', `Bearer ${t}`)
      .send({ name: 'squat' });
    assert.ok(res.body.success);
    assert.ok(res.body.exercise);
  });

  it('errors out if user cannot be authenticated', async () => {
    const res = await request(server)
      .post(p)
      .set('Authorization', 'foobar')
      .send({ name: 'squat' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Unauthorized');
  });

  it('errors out if exercise has no name', async () => {
    const res = await request(server)
      .post(p)
      .set('Authorization', `Bearer ${t}`)
      .send({ foo: 'bar' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Exercise name is required');
  });

  it('errors out if exercise name is too long', async () => {
    const res = await request(server)
      .post(p)
      .set('Authorization', `Bearer ${t}`)
      .send({ name: 'fjwifehwofheiuwfhweofewjfowefweofjeowifjeowfjeiowfjowifjiowj' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Name too long (25 char max)');
  });

  it('errors out if exercise already exists', async () => {
    const res = await request(server)
      .post(p)
      .set('Authorization', `Bearer ${t}`)
      .send({ name: 'squat' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Exercise already exists');
  });
});
