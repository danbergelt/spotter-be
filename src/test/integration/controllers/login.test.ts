import { use, request } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/express';
import assert from 'assert';

use(http);

const userPath = path('/users');

describe('login', () => {
  const p = userPath('/login');

  // TODO --> convert to shell script that runs before all tests (AKA database seeder)
  before(async () => {
    await request(server)
      .post(userPath('/registration'))
      .send({ email: 'login@login.com', password: 'foobar' });
  });

  it('can login', async () => {
    const res = await request(server)
      .post(p)
      .send({ email: 'login@login.com', password: 'foobar' });

    assert.ok(res.body.success);
    assert.ok(res.body.token);
    assert.ok(res.header['set-cookie'][0].startsWith('ref='));
  });

  it('cannnot login if email is incorrect', async () => {
    const res = await request(server)
      .post(p)
      .send({ email: 'bad@bad.com', password: 'foobar' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid credentials');
  });

  it('cannot login if password is incorrect', async () => {
    const res = await request(server)
      .post(p)
      .send({ email: 'login@login.com', password: 'barfoo' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid credentials');
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
    assert.equal(res.body.error, 'Invalid email - must be string');
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
    assert.equal(res.body.error, 'Invalid password - must be string');
  });
});
