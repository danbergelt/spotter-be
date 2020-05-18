import { request, use } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/express';
import assert from 'assert';
import { token } from '../../../utils/jwt';
import { ObjectId } from 'mongodb';

use(http);

const p = path('/users')('/refresh');

describe('refresh', () => {
  it('returns a token and a cookie', async () => {
    const { header } = await request(server)
      .post(path('/users')('/registration'))
      .send({ email: 'refresh@refresh.com', password: 'refresh' });
    const cookie = (header['set-cookie'][0] as string).split('=')[1].split(';')[0];
    const res = await request(server)
      .post(p)
      .set('Cookie', `ref=${cookie}`);
    assert.ok(res.body.success);
    assert.ok(res.body.token);
    assert.ok(res.header['set-cookie'][0].startsWith('ref=e'));
  });

  it('returns a null token if no cookie is present', async () => {
    const res = await request(server).post(p);
    assert.ok(!res.body.success);
    assert.equal(res.body.token, null);
  });

  it('returns a null token if cookie is not a verified jwt', async () => {
    const res = await request(server)
      .post(p)
      .set('Cookie', 'ref=foo');
    assert.ok(!res.body.success);
    assert.equal(res.body.token, null);
  });

  it('returns a null token if cookie does not contains a user id', async () => {
    const res = await request(server)
      .post(p)
      .set('Cookie', `ref=${token(new ObjectId())}`);
    assert.ok(!res.body.success);
    assert.equal(res.body.token, null);
  });
});
