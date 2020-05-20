import { use, request } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/express';
import assert from 'assert';

use(http);

const p = path('/users')('/registration');

describe('registration', () => {
  it('can register', async () => {
    const res = await request(server)
      .post(p)
      .send({ email: 'foo@bar.com', password: 'foobar' });
    assert.ok(res.body.success);
    assert.ok(res.body.token);
    assert.ok(res.header['set-cookie'][0].startsWith('ref='));
  });

  it('errors out if email is invalid', async () => {
    const res = await request(server)
      .post(p)
      .send({ email: 'foo', password: 'foobar' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid email');
  });

  it('errors out with missing email', async () => {
    const res = await request(server)
      .post(p)
      .send({ password: 'foobar' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid email');
  });

  it('errors out if password is too short', async () => {
    const res = await request(server)
      .post(p)
      .send({ email: 'will@fail.com', password: 'foo' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Password too short (6 char min)');
  });

  it('errors out with missing password', async () => {
    const res = await request(server)
      .post(p)
      .send({ email: 'will@fail.com' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid password');
  });

  it('errors out if user already exists', async () => {
    await request(server)
      .post(p)
      .send({ email: 'a@b.com', password: 'password' });

    const res = await request(server)
      .post(p)
      .send({ email: 'a@b.com', password: 'password' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'User already exists');
  });
});
