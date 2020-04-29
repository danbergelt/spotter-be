import { cleanError } from '../../../utils/cleanError';
import assert from 'assert';

describe('clean http error message', () => {
  it('returns the error if pattern is not matched', () => {
    const err = cleanError('foo');
    assert.equal(err, 'foo');
  });

  it('cleans an E11000 error message from mongo', () => {
    const err = cleanError(
      'E11000 duplicate key error collection: foobar index: email_1 dup key: { email: "fake" }'
    );
    assert.equal(err, 'Email already exists, try again');
  });
});
