import { use, request } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/express';
import { ObjectId } from 'mongodb';
import { token } from '../../../utils/jwt';
import assert from 'assert';

const p = path('/exercises');

const { TEST_ID } = process.env;
const t = token(new ObjectId(TEST_ID));

use(http);

describe('read exercises', () => {
  it('reads exercises', async () => {
    await request(server)
      .post(p(''))
      .set('Authorization', `Bearer ${t}`)
      .send({ name: 'foo' });

    const res = await request(server)
      .get(p(''))
      .set('Authorization', `Bearer ${t}`);

    assert.ok(res.body.success);
    assert.notEqual(res.body.exercises.length, 0);
  });

  it('errors out if user cannot be authenticated', async () => {
    const res = await request(server)
      .get(p(''))
      .set('Authorization', 'foobar');

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Unauthorized');
  });
});
