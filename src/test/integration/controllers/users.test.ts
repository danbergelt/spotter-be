import { use, request } from 'chai';
import http from 'chai-http';
import { path } from '../../../utils/express';
import server from '../../..';
import assert from 'assert';
import { tokenFactory } from '../../../utils/jwt';

const usersPath = '/users';

use(http);

const body = {
  message: 'foo',
  subject: 'bar',
  email: 'foo@bar.com',
  name: 'baz'
};

// TODO --> need to figure out how to throw mailgun in test mode to test catching

describe('contact form', () => {
  it('sends a contact form', async () => {
    const res = await request(server)
      .post(path([usersPath, '/contact']))
      .send(body);
    assert.ok(res.body.success);
    assert.equal(res.body.message, 'Message sent');
  });

  it('errors out if body cannot be authenticated', async () => {
    const res = await request(server)
      .post(path([usersPath, '/contact']))
      .send({ message: 'foo', subject: 'foo', email: 'foo', name: 'foo' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid email');
  });
});

describe('registration', () => {
  it('can register', async () => {
    const res = await request(server)
      .post(path([usersPath, '/registration']))
      .send({ email: 'register@register.com', password: 'foobar' });
    assert.ok(res.body.success);
    assert.ok(res.body.token);
    assert.ok(res.header['set-cookie'][0].startsWith('ref='));
  });

  it('errors out if body is invalid', async () => {
    const res = await request(server)
      .post(path([usersPath, '/registration']))
      .send({ email: 'foo', password: 'foobar' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid email');
  });

  it('errors out if user already exists', async () => {
    const res = await request(server)
      .post(path([usersPath, '/registration']))
      .send({ email: 'register@register.com', password: 'foobar' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'User already exists');
  });
});

describe('login', () => {
  before(async () => {
    await request(server)
      .post(path([usersPath, '/registration']))
      .send({ email: 'login@login.com', password: 'foobar' });
  });

  it('can login', async () => {
    const res = await request(server)
      .post(path([usersPath, '/login']))
      .send({ email: 'login@login.com', password: 'foobar' });

    assert.ok(res.body.success);
    assert.ok(res.body.token);
    assert.ok(res.header['set-cookie'][0].startsWith('ref='));
  });

  it('cannot login if body is bad', async () => {
    const res = await request(server)
      .post(path([usersPath, '/login']))
      .send({ email: 'foo', password: 'foobar' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid email');
  });

  it('cannnot login if body is invalid', async () => {
    const res = await request(server)
      .post(path([usersPath, '/login']))
      .send({ email: 'bad@bad.com', password: 'foobar' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid credentials');
  });

  it('cannot login with wrong password', async () => {
    const res = await request(server)
      .post(path([usersPath, '/login']))
      .send({ email: 'login@login.com', password: 'barfoo' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid credentials');
  });
});

describe('refresh', () => {
  it('returns a token and a cookie', async () => {
    const { header } = await request(server)
      .post(path([usersPath, '/registration']))
      .send({ email: 'refresh@refresh.com', password: 'refresh' });

    const cookie = (header['set-cookie'][0] as string)
      .split('=')[1]
      .split(';')[0];

    const res = await request(server)
      .post(path([usersPath, '/refresh']))
      .set('Cookie', `ref=${cookie}`);

    assert.ok(res.body.success);
    assert.ok(res.body.token);
    assert.ok(res.header['set-cookie'][0].startsWith('ref=e'));
  });

  it('returns a null token if no cookie is present', async () => {
    const res = await request(server).post(path([usersPath, '/refresh']));

    assert.ok(!res.body.success);
    assert.equal(res.body.token, null);
  });

  it('returns a null token if cookie is not a verified jwt', async () => {
    const res = await request(server)
      .post(path([usersPath, '/refresh']))
      .set('Cookie', 'ref=foo');

    assert.ok(!res.body.success);
    assert.equal(res.body.token, null);
  });

  it('returns a null token if cookie does not contain a valid user id', async () => {
    const res = await request(server)
      .post(path([usersPath, '/refresh']))
      .set(
        'Cookie',
        `ref=${tokenFactory({
          id: -1,
          sec: String(process.env.AUTH_SECRET),
          exp: String(process.env.AUTH_EXPIRE)
        })}`
      );

    assert.ok(!res.body.success);
    assert.equal(res.body.token, null);
  });
});

describe('logout', () => {
  it('logs user out', async () => {
    const res = await request(server).post(path([usersPath, '/logout']));
    assert.ok(res.header['set-cookie'][0].startsWith('ref=;'));
  });
});
