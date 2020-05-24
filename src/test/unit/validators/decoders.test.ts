import {
  userDecoder,
  contactDecoder,
  exerciseDecoder,
  ownerDecoder,
  savedDecoder,
  tagDecoder,
  workoutDecoder
} from '../../../validators/decoders';
import assert from 'assert';
import { isLeft, isRight } from 'fp-ts/lib/Either';
import { ObjectId } from 'mongodb';

describe('user decoder', () => {
  it('errors out when email is missing', () => {
    const foo = { password: 'password' };
    const result = userDecoder.decode(foo);
    const expected = 'Invalid email - must be non-empty string';
    assert.ok(isLeft(result) && result.left[0].message === expected);
  });

  it('errors out when email is not a string', () => {
    const foo = { email: 1, password: 'password' };
    const result = userDecoder.decode(foo);
    const expected = 'Invalid email - must be non-empty string';
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
    const expected = 'Invalid password - must be non-empty string';
    assert.ok(isLeft(result) && result.left[0].message === expected);
  });

  it('errors out when password is not a string', () => {
    const foo = { email: 'foo@bar.com', password: 1 };
    const result = userDecoder.decode(foo);
    const expected = 'Invalid password - must be non-empty string';
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
    assert.ok(
      isLeft(result) && result.left[0].message === 'Invalid name - must be non-empty string'
    );
  });

  it('errors out when name is not a string', () => {
    const foo = { name: 1, email: 'foo@bar.com', subject: 'foo', message: 'bar' };
    const result = contactDecoder.decode(foo);
    assert.ok(
      isLeft(result) && result.left[0].message === 'Invalid name - must be non-empty string'
    );
  });

  it('errors out when email is missing', () => {
    const foo = { name: 'foo', subject: 'foo', message: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.ok(
      isLeft(result) && result.left[0].message === 'Invalid email - must be non-empty string'
    );
  });

  it('errors out when email is not a string', () => {
    const foo = { email: 1, name: 'foo', subject: 'foo', message: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.ok(
      isLeft(result) && result.left[0].message === 'Invalid email - must be non-empty string'
    );
  });

  it('errors out when email is invalid format', () => {
    const foo = { email: 'foo', name: 'foo', subject: 'foo', message: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.ok(isLeft(result) && result.left[0].message === 'Invalid email');
  });

  it('errors out when subject is missing', () => {
    const foo = { email: 'foo@bar.com', name: 'foo', message: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.ok(
      isLeft(result) && result.left[0].message === 'Invalid subject - must be non-empty string'
    );
  });

  it('errors out when subject is not a string', () => {
    const foo = { email: 'foo@bar.com', name: 'foo', message: 'foo', subject: 1 };
    const result = contactDecoder.decode(foo);
    assert.ok(
      isLeft(result) && result.left[0].message === 'Invalid subject - must be non-empty string'
    );
  });

  it('errors out when message is missing', () => {
    const foo = { email: 'foo@bar.com', name: 'foo', subject: 'foo' };
    const result = contactDecoder.decode(foo);
    assert.ok(
      isLeft(result) && result.left[0].message === 'Invalid message - must be non-empty string'
    );
  });

  it('errors out when message is not a string', () => {
    const foo = { email: 'foo@bar.com', name: 'foo', subject: 'foo', message: 1 };
    const result = contactDecoder.decode(foo);
    assert.ok(
      isLeft(result) && result.left[0].message === 'Invalid message - must be non-empty string'
    );
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
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid exercise name - must be non-empty string'
    );
  });

  it('errors out when exercise name is not a string', () => {
    const foo = { user: new ObjectId(), name: 1 };
    const result = exerciseDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid exercise name - must be non-empty string'
    );
  });

  it('errors out when exercise name is too long', () => {
    const foo = { name: 'jeiowfjeiowfjeiowjfioewjfweiofjioewjfiowjfo', user: new ObjectId() };
    const result = exerciseDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Exercise name too long (25 char max)');
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
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid pr - must be number');
  });

  it('errors out if pr date is not a string', () => {
    const foo = { name: 'foobar', prDate: 1, user: new ObjectId() };
    const result = exerciseDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid date - must be non-empty string'
    );
  });

  it('errors out if pr date is invalid', () => {
    const foo = { name: 'foobar', prDate: 'foo', user: new ObjectId() };
    const result = exerciseDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid date');
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

describe('tag decoder', () => {
  const color = '#8FBC8F';
  it('errors out when no owner exists', () => {
    const foo = { color };
    const result = tagDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out when id is invalid object id', () => {
    const foo = { user: 'foo', color };
    const result = tagDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out when id is not class instantiation', () => {
    const foo = { user: process.env.TEST_ID, color };
    const result = tagDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out if color is missing', () => {
    const foo = { user: new ObjectId() };
    const result = tagDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid color - must be non-empty string'
    );
  });

  it('errors out if color is not a string', () => {
    const foo = { user: new ObjectId(), color: 1 };
    const result = tagDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid color - must be non-empty string'
    );
  });

  it('errors out if color is not hex color', () => {
    const foo = { user: new ObjectId(), color: 'red' };
    const result = tagDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid color - must be hex');
  });

  it('errors out if content is not a string', () => {
    const foo = { user: new ObjectId(), color, content: 1 };
    const result = tagDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid tag content - must be non-empty string'
    );
  });

  it('errors out if content is too long', () => {
    const foo = {
      user: new ObjectId(),
      color,
      content: 'jowjfoiw3fjiowjfeiowfjewiofjeiowfjeiowfjeiowfjewiojfojw'
    };
    const result = tagDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Tag content too long (20 char max)');
  });

  it('allows content to be optional', () => {
    const foo = { user: new ObjectId(), color, content: undefined };
    const result = tagDecoder.decode(foo);
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });

  it('strips junk fields', () => {
    const foo = { user: new ObjectId(), color, content: 'foo' };
    const result = tagDecoder.decode({ ...foo, foo: 'bar' });
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });

  it('validates', () => {
    const foo = { user: new ObjectId(), color, content: 'foo' };
    const result = tagDecoder.decode(foo);
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

describe('workout decoder', () => {
  it('errors out if date is undefined', () => {
    const foo = { user: new ObjectId(), title: 'foo' };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid date - must be non-empty string'
    );
  });

  it('errors out if date is not a string', () => {
    const foo = { user: new ObjectId(), title: 'foo', date: 1 };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid date - must be non-empty string'
    );
  });

  it('errors out if date is empty string', () => {
    const foo = { user: new ObjectId(), title: 'foo', date: '' };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid date - must be non-empty string'
    );
  });

  it('errors out if date is not a valid date', () => {
    const foo = { user: new ObjectId(), title: 'foo', date: 'foo' };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid date');
  });

  it('errors out if title is undefined', () => {
    const foo = { user: new ObjectId(), date: 'Jan 01 2000' };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid workout title - must be non-empty string'
    );
  });

  it('errors out if title is not a string', () => {
    const foo = { user: new ObjectId(), date: 'Jan 01 2000', title: 1 };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid workout title - must be non-empty string'
    );
  });

  it('errors out if title is too long', () => {
    const foo = {
      user: new ObjectId(),
      date: 'Jan 01 2000',
      title: 'feiopwfjweiofjeiowfjeiowfjewiofjeiowfjeiowfjeiowfjow'
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Workout title too long (25 char max)');
  });

  it('errors out if user id is undefined', () => {
    const foo = { date: 'Jan 01 2000', title: 'foo' };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out if user id is not object id instance', () => {
    const foo = { date: 'Jan 01 2000', title: 'foo', user: process.env.TEST_ID };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out if notes is not a string', () => {
    const foo = { date: 'Jan 01 2000', title: 'foo', user: new ObjectId(), notes: 1 };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid notes - must be non-empty string'
    );
  });

  it('errors out if tag does not contain color', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      tags: [{ user: new ObjectId(), _id: new ObjectId() }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid color - must be non-empty string'
    );
  });

  it('errors out if tag color is not a string', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      tags: [{ user: new ObjectId(), _id: new ObjectId(), color: 1 }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid color - must be non-empty string'
    );
  });

  it('errors out if tag color is not a hex color', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      tags: [{ user: new ObjectId(), _id: new ObjectId(), color: 'foo' }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid color - must be hex');
  });

  it('errors out if tag user id is missing', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      tags: [{ _id: new ObjectId(), color: '#4287f5' }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out if tag user id is not object id instance', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      tags: [{ _id: new ObjectId(), user: process.env.TEST_ID, color: '#4287f5' }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid user id');
  });

  it('errors out if tag primary key is undefined', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      tags: [{ user: new ObjectId(), color: '#4287f5' }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid id');
  });

  it('errors out if tag primary key is not object id instance', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      tags: [{ _id: process.env.TEST_ID, user: new ObjectId(), color: '#4287f5' }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid id');
  });

  it('errors out if tag content is not a string', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      tags: [{ _id: new ObjectId(), user: new ObjectId(), color: '#4287f5', content: 1 }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid tag content - must be non-empty string'
    );
  });

  it('errors out if tag content is too long', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      tags: [
        {
          _id: new ObjectId(),
          user: new ObjectId(),
          color: '#4287f5',
          content: 'fjkewiofjweifjeiowfjeiowfjeiowfjeiowfjeiowfjeiow'
        }
      ]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Tag content too long (20 char max)');
  });

  it('errors out if exercise does not have a name', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: [{}]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid exercise name - must be non-empty string'
    );
  });

  it('errors out when exercise name is not a string', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: [{ name: 1 }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'Invalid exercise name - must be non-empty string'
    );
  });

  it('errors out when exercise name is too long', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: [{ name: 'fjeiowfjeiowjfeiowfjeiowjfeiowfjeiowjfeiowfjeiowfj' }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Exercise name too long (25 char max)');
  });

  it('errors out when sets are not a number', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: [{ name: 'foo', sets: 'bar' }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid sets - must be number');
  });

  it('errors out when sets > 2000', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: [{ name: 'foo', sets: 2001 }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, '2000 sets limit');
  });

  it('errors out when reps are not a number', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: [{ name: 'foo', reps: 'bar' }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid reps - must be number');
  });

  it('errors out when reps > 2000', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: [{ name: 'foo', reps: 2001 }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, '2000 reps limit');
  });

  it('errors out when weight is not a number', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: [{ name: 'foo', weight: 'bar' }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, 'Invalid weight - must be number');
  });

  it('errors out when weight > 2000', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: [{ name: 'foo', weight: 2001 }]
    };
    const result = workoutDecoder.decode(foo);
    assert.equal(isLeft(result) && result.left[0].message, '2000 lb limit');
  });

  it('strips junk fields', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: undefined,
      notes: undefined,
      tags: undefined
    };
    const result = workoutDecoder.decode({ ...foo, foo: 'bar' });
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });

  it('validates', () => {
    const foo = {
      date: 'Jan 01 2000',
      title: 'foo',
      user: new ObjectId(),
      exercises: [
        { name: 'foobar', weight: 100, sets: 100, reps: 200 },
        { name: 'barbaz', weight: 24, sets: 42, reps: 23 }
      ],
      notes: 'foo',
      tags: [{ color: '#4287f5', content: 'bar', _id: new ObjectId(), user: new ObjectId() }]
    };
    const result = workoutDecoder.decode({ ...foo, foo: 'bar' });
    assert.deepStrictEqual(isRight(result) && result.right, foo);
  });
});
