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
const green = '#8FBC8F';

describe('post tag', () => {
  it('posts a tag', async () => {
    const res = await request(server)
      .post(p(''))
      .set('Authorization', `Bearer ${t}`)
      .send({ color: green, content: 'foo' });

    assert.ok(res.body.success);
    assert.ok(res.body.tag.color);
    assert.ok(res.body.tag.content);
    assert.ok(res.body.tag.user);
    assert.ok(res.body.tag._id);
  });

  it('errors out if user cannot be authenticated', async () => {
    const res = await request(server)
      .post(p(''))
      .set('Authorization', 'foobar')
      .send({ color: green, content: 'foo' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Unauthorized');
  });

  it('errors out if tag is invalid', async () => {
    const res = await request(server)
      .post(p(''))
      .set('Authorization', `Bearer ${t}`)
      .send({});
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid color - must be non-empty string');
  });

  it('errors out if tag already exists', async () => {
    const res = await request(server)
      .post(p(''))
      .set('Authorization', `Bearer ${t}`)
      .send({ color: green, content: 'foo' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Tag already exists');
  });

  it('errors out if tag already exists (no content)', async () => {
    await request(server)
      .post(p(''))
      .set('Authorization', `Bearer ${t}`)
      .send({ color: green });

    const res = await request(server)
      .post(p(''))
      .set('Authorization', `Bearer ${t}`)
      .send({ color: green });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Tag already exists');
  });
});
