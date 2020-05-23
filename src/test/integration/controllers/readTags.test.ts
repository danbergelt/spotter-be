import { request, use } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/express';
import { token } from '../../../utils/jwt';
import { ObjectId } from 'mongodb';
import assert from 'assert';

use(http);

const p = path('/tags');
const t = token(new ObjectId(process.env.TEST_ID));

describe('read tags', () => {
  it('reads all tags for a user', async () => {
    const res = await request(server)
      .get(p(''))
      .set('Authorization', `Bearer ${t}`);
    assert.ok(res.body.success);
    assert.ok(res.body.tags);
  });

  it('errors out if user cannot be authenticated', async () => {
    const res = await request(server).get(p(''));
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Unauthorized');
  });
});
