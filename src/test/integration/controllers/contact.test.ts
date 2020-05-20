import { use, request } from 'chai';
import http from 'chai-http';
import { path } from '../../../utils/express';
import server from '../../../';
import assert from 'assert';

const p = path('/users')('/contact');

use(http);

const body = { message: 'foo', subject: 'bar', email: 'foo@bar.com', name: 'baz' };

// TODO --> need to figure out how to throw mailgun in test mode to test catching

describe('contact form', () => {
  it('sends a contact form', async () => {
    const res = await request(server)
      .post(p)
      .send(body);
    assert.ok(res.body.success);
    assert.equal(res.body.message, 'Message sent');
  });

  it('errors out name is not present', async () => {
    const res = await request(server)
      .post(p)
      .send({ message: 'foo', subject: 'bar', email: 'foo@bar.com' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid name');
  });

  it('errors out email is not present', async () => {
    const res = await request(server)
      .post(p)
      .send({ message: 'foo', subject: 'bar', name: 'baz' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid email');
  });

  it('errors out subject is not present', async () => {
    const res = await request(server)
      .post(p)
      .send({ message: 'foo', email: 'foo@bar.com', name: 'bar' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid subject');
  });

  it('errors out if message is not present', async () => {
    const res = await request(server)
      .post(p)
      .send({ name: 'foo', subject: 'bar', email: 'foo@bar.com' });
    assert.ok(!res.body.success);
    assert.equal(res.body.error, 'Invalid message');
  });
});
