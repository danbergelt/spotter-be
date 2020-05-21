import {
  userDecoder,
  contactDecoder,
  exerciseDecoder,
  ownerDecoder,
  savedDecoder
} from '../../../validators/decoders';
import assert from 'assert';
import { isLeft, isRight } from 'fp-ts/lib/Either';
import { ObjectId } from 'mongodb';

describe('user decoder', () => {
  it('errors out when email is missing', () => {
    const foo = { password: 'password' };
    const result = userDecoder.decode(foo);
    const expected = 'Invalid email';
    assert.ok(isLeft(result) && result.left[0].message === expected);
  });

  it('errors out when email is not a string', () => {
    const foo = { email: 1, password: 'password' };
    const result = userDecoder.decode(foo);
    const expected = 'Invalid email';
    assert.ok(isLeft(result) && result.left[0].message === expected);
  });

  it('errors out when email is invalid format', () => {
    const foo = { email: 'foo', password: 'password' };
    const result = userDecoder.decode(foo);
    const expected = 'Invalid email';
    assert.ok(isLeft(result) && result.left[0].message === expected);
  });

  it('errors out when password is missing', () => {
    const foo = { email: 'foo@bar.com' };
    const result = userDecoder.decode(foo);
    const expected = 'Invalid password';
    assert.ok(isLeft(result) && result.left[0].message === expected);
  });

  it('errors out when password is not a string', () => {
    const foo = { email: 'foo@bar.com', password: 1 };
    const result = userDecoder.decode(foo);
    const expected = 'Invalid password';
    assert.ok(isLeft(result) && result.left[0].message === expected);
  });

  it('errors out when password is too short', () => {
    const foo = { email: 'foo@bar.com', password: 'foo' };
    const result = userDecoder.decode(foo);
    const expected = 'Password too short (6 char min)';
    assert.ok(isLeft(result) && result.left[0].message === expected);
  });

  it('strips junk fields', () => {
    const foo = { email: 'foo@bar.com', password: 'foobar' };
    const result = userDecoder.decode({ ...foo, foo: 'bar' });
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });

  it('returns right on successful validation', () => {
    const foo = { email: 'foo@bar.com', password: 'foobar' };
    const result = userDecoder.decode(foo);
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });
});

describe('contact decoder', () => {
  it('errors out when name is missing', () => {
    const foo = { email: 'foo@bar.com', subject: 'foo', message: 'bar' };
    const result = contactDecoder.decode(foo);
    assert.ok(isLeft(result) && result.left[0].message === 'Invalid name');
  });

  it('errors out when name is not a string', () => {
    const foo = { name: 1, email: 'foo@bar.com', subject: 'foo', message: 'bar' };
    const result = contactDecoder.decode(foo);
    assert.ok(isLeft(result) && result.left[0].message === 'Invalid name');
  });

  it('errors out when email is missing', () => {
    const foo = { name: 'foo', subject: 'foo', message: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.ok(isLeft(result) && result.left[0].message === 'Invalid email');
  });

  it('errors out when email is not a string', () => {
    const foo = { email: 1, name: 'foo', subject: 'foo', message: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.ok(isLeft(result) && result.left[0].message === 'Invalid email');
  });

  it('errors out when email is invalid format', () => {
    const foo = { email: 'foo', name: 'foo', subject: 'foo', message: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.ok(isLeft(result) && result.left[0].message === 'Invalid email');
  });

  it('errors out when subject is missing', () => {
    const foo = { email: 'foo@bar.com', name: 'foo', message: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.ok(isLeft(result) && result.left[0].message === 'Invalid subject');
  });

  it('errors out when subject is not a string', () => {
    const foo = { email: 'foo@bar.com', name: 'foo', message: 'foo', subject: 1 };
    const result = contactDecoder.decode(foo);
    assert.ok(isLeft(result) && result.left[0].message === 'Invalid subject');
  });

  it('errors out when message is missing', () => {
    const foo = { email: 'foo@bar.com', name: 'foo', subject: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.ok(isLeft(result) && result.left[0].message === 'Invalid message');
  });

  it('errors out when message is not a string', () => {
    const foo = { email: 'foo@bar.com', name: 'foo', subject: 'foo', message: 1 };
    const result = contactDecoder.decode(foo);
    assert.ok(isLeft(result) && result.left[0].message === 'Invalid message');
  });

  it('strips junk fields', () => {
    const foo = { email: 'foo@bar.com', name: 'foo', subject: 'foo', message: 'foo' };
    const result = contactDecoder.decode({ ...foo, foo: 'bar' });
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });

  it('validates and returns the object as a right', () => {
    const foo = { email: 'foo@bar.com', name: 'foo', subject: 'foo', message: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });
});

describe('exercise decoder', () => {
  it('errors out when name is missing', () => {
    const foo = { user: new ObjectId() };
    const result = exerciseDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid name');
  });

  it('errors out when exercise name is too long', () => {
    const foo = { name: 'jeiowfjeiowfjeiowjfioewjfweiofjioewjfiowjfo', user: new ObjectId() };
    const result = exerciseDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Name too long (25 char max)');
  });

  it('errors out when user is missing', () => {
    const foo = { name: 'foobar' };
    const result = exerciseDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out when user id is invalid', () => {
    const foo = { name: 'foobar', user: 'foobar' };
    const result = exerciseDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out if pr is not a number', () => {
    const foo = { name: 'foobar', pr: 'foo', user: new ObjectId() };
    const result = exerciseDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid pr');
  });

  it('errors out if pr date is not a string', () => {
    const foo = { name: 'foobar', prDate: 1, user: new ObjectId() };
    const result = exerciseDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid pr date');
  });

  it('errors out if pr date is invalid', () => {
    const foo = { name: 'foobar', prDate: 'foo', user: new ObjectId() };
    const result = exerciseDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid pr date');
  });

  it('allows pr and prDate to be optional', () => {
    const foo = { name: 'foobar', pr: undefined, prDate: undefined, user: new ObjectId() };
    const result = exerciseDecoder.decode(foo);
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });

  it('strips junk fields', () => {
    const foo = { name: 'foobar', pr: undefined, prDate: undefined, user: new ObjectId() };
    const result = exerciseDecoder.decode({ ...foo, foo: 'bar' });
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });

  it('validates and returns the object as a right', () => {
    const foo = { name: 'foobar', pr: 100, prDate: 'Jan 01 2000', user: new ObjectId() };
    const result = exerciseDecoder.decode(foo);
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });
});

describe('owner', () => {
  it('errors out when no owner exists', () => {
    const foo = {};
    const result = ownerDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out when id is invalid object id', () => {
    const foo = { user: 'foo' };
    const result = ownerDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out when id is not class instantiation', () => {
    const foo = { user: process.env.TEST_ID };
    const result = ownerDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('strips junk fields', () => {
    const foo = { user: new ObjectId() };
    const result = ownerDecoder.decode({ ...foo, foo: 'bar' });
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });

  it('validates', () => {
    const foo = { user: new ObjectId() };
    const result = ownerDecoder.decode(foo);
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });
});

describe('saved', () => {
  it('errors out when no id exists', () => {
    const foo = {};
    const result = savedDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid id');
  });

  it('errors out when id is invalid object id', () => {
    const foo = { _id: 'foo' };
    const result = savedDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid id');
  });

  it('errors out when id is not class instantiation', () => {
    const foo = { _id: process.env.TEST_ID };
    const result = savedDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid id');
  });

  it('strips junk fields', () => {
    const foo = { _id: new ObjectId() };
    const result = savedDecoder.decode({ ...foo, foo: 'bar' });
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });

  it('validates', () => {
    const foo = { _id: new ObjectId() };
    const result = savedDecoder.decode(foo);
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });
});
