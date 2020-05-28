import { use, request } from 'chai';
import http from 'chai-http';
import { path } from '../../../utils/express';
import server from '../../..';
import assert from 'assert';
import { token } from '../../../utils/jwt';

const p = path('/users');

use(http);

const body = { message: 'foo', subject: 'bar', email: 'foo@bar.com', name: 'baz' };

// TODO --> need to figure out how to throw mailgun in test mode to test catching

describe('contact form', () => {
  it('sends a contact form', async () => {
    const res = await request(server)
      .post(p('/contact'))
      .send(body);
    assert.ok(res.body.success);
    assert.equal(res.body.message, 'Message sent');
  });

  it('errors out if body cannot be authenticated', async () => {
    const res = await request(server)
      .post(p('/contact'))
      .send({ message: 'foo', subject: 'foo', email: 'foo', name: 'foo' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid email');
  });
});

describe('registration', () => {
  it('can register', async () => {
    const res = await request(server)
      .post(p('/registration'))
      .send({ email: 'register@register.com', pw: 'foobar' });
    assert.ok(res.body.success);
    assert.ok(res.body.token);
    assert.ok(res.header['set-cookie'][0].startsWith('ref='));
  });

  it('errors out if body is invalid', async () => {
    const res = await request(server)
      .post(p('/registration'))
      .send({ email: 'foo', pw: 'foobar' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid email');
  });

  it('errors out if user already exists', async () => {
    const res = await request(server)
      .post(p('/registration'))
      .send({ email: 'register@register.com', pw: 'foobar' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'User already exists');
  });
});

describe('login', () => {
  // TODO --> convert to shell script that runs before all tests (AKA database seeder)
  before(async () => {
    await request(server)
      .post(p('/registration'))
      .send({ email: 'login@login.com', pw: 'foobar' });
  });

  it('can login', async () => {
    const res = await request(server)
      .post(p('/login'))
      .send({ email: 'login@login.com', pw: 'foobar' });

    assert.ok(res.body.success);
    assert.ok(res.body.token);
    assert.ok(res.header['set-cookie'][0].startsWith('ref='));
  });

  it('cannot login if body is bad', async () => {
    const res = await request(server)
      .post(p('/login'))
      .send({ email: 'foo', pw: 'foobar' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid email');
  });

  it('cannnot login if body is invalid', async () => {
    const res = await request(server)
      .post(p('/login'))
      .send({ email: 'bad@bad.com', pw: 'foobar' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid credentials');
  });

  it('cannot login with wrong pw', async () => {
    const res = await request(server)
      .post(p('/login'))
      .send({ email: 'login@login.com', pw: 'barfoo' });

    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid credentials');
  });
});

describe('refresh', () => {
  it('returns a token and a cookie', async () => {
    const { header } = await request(server)
      .post(p('/registration'))
      .send({ email: 'refresh@refresh.com', pw: 'refresh' });

    const cookie = (header['set-cookie'][0] as string).split('=')[1].split(';')[0];

    const res = await request(server)
      .post(p('/refresh'))
      .set('Cookie', `ref=${cookie}`);

    assert.ok(res.body.success);
    assert.ok(res.body.token);
    assert.ok(res.header['set-cookie'][0].startsWith('ref=e'));
  });

  it('returns a null token if no cookie is present', async () => {
    const res = await request(server).post(p('/refresh'));

    assert.ok(!res.body.success);
    assert.equal(res.body.token, null);
  });

  it('returns a null token if cookie is not a verified jwt', async () => {
    const res = await request(server)
      .post(p('/refresh'))
      .set('Cookie', 'ref=foo');

    assert.ok(!res.body.success);
    assert.equal(res.body.token, null);
  });

  it('returns a null token if cookie does not contain a valid user id', async () => {
    const res = await request(server)
      .post(p('/refresh'))
      .set(
        'Cookie',
        `ref=${token(-1, String(process.env.JWT_SECRET), String(process.env.JWT_EXPIRE))}`
      );

    assert.ok(!res.body.success);
    assert.equal(res.body.token, null);
  });
});

describe('logout', () => {
  it('logs user out', async () => {
    const res = await request(server).post(p('/logout'));
    assert.ok(res.header['set-cookie'][0].startsWith('ref=;'));
  });
});
