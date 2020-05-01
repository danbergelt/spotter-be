import { sanitizeError, isDuplicateKeyError, forkMongoError } from '../../../utils/sanitization';
import assert from 'assert';

describe('clean http error message', () => {
  it('returns the error if pattern is not matched', () => {
    const err = sanitizeError('foo');
    assert.equal(err, 'foo');
  });

  it('cleans an E11000 error message from mongo', () => {
    const err = sanitizeError(
      'E11000 duplicate key error collection: foobar index: email_1 dup key: { email: "fake" }'
    );
    assert.equal(err, 'Email already exists, try again');
  });
});

describe('isDuplicateKeyError', () => {
  it('returns true if error starts with E11000', () => {
    const result = isDuplicateKeyError('E11000 Error');
    assert.ok(result);
  });

  it('returns false if error does not start with E11000', () => {
    const result = isDuplicateKeyError('foo');
    assert.ok(!result);
  });
});

describe('forkMongoError', () => {
  it('returns a bad gateway error if message is undefined', () => {
    const result = forkMongoError('foo');
    assert.deepStrictEqual(result, { message: 'Bad gateway', status: 502 });
  });

  it('returns a bad gateway error if not duplicate key error', () => {
    const result = forkMongoError({ message: 'foo' });
    assert.deepStrictEqual(result, { message: 'Bad gateway', status: 502 });
  });

  it('sanitizes the error and returns a validation error if duplicate key error', () => {
    const result = forkMongoError({
      message:
        'E11000 duplicate key error collection: foobar index: email_1 dup key: { email: "fake" }'
    });
    assert.deepStrictEqual(result, { message: 'Email already exists, try again', status: 400 });
  });
});
