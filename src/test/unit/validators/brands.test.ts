import { str, num, email, password } from '../../../validators/brands';
import assert from 'assert';
import { right, isLeft } from 'fp-ts/lib/Either';

describe('str', () => {
  it('validates and trims a string', () => {
    const result = str('foo').decode('bar                ');
    const expected = right('bar');
    assert.deepStrictEqual(result, expected);
  });

  it('returns a message if not a string', () => {
    const result = str('foo').decode(1);
    assert.equal(
      isLeft(result) && result.left[0].message,
      'foo must be a string'
    );
  });
});

describe('num', () => {
  it('validates a num', () => {
    const result = num('foo').decode(5);
    const expected = right(5);
    assert.deepStrictEqual(result, expected);
  });

  it('returns a message if not a num', () => {
    const result = num('foo').decode('bar');
    assert.equal(
      isLeft(result) && result.left[0].message,
      'foo must be a number'
    );
  });

  describe('email', () => {
    it('validates an email', () => {
      const result = email.decode('foo@bar.com');
      const expected = right('foo@bar.com');
      assert.deepStrictEqual(result, expected);
    });

    it('returns a message if not an email', () => {
      const result = email.decode('foo');
      assert.equal(isLeft(result) && result.left[0].message, 'Invalid email');
    });
  });

  describe('password', () => {
    it('validates a password', () => {
      const result = password.decode('somepassword');
      const expected = right('somepassword');
      assert.deepStrictEqual(result, expected);
    });

    it('returns a message if not a password', () => {
      const result = password.decode('foo');
      assert.equal(
        isLeft(result) && result.left[0].message,
        'Password too short (6 char min)'
      );
    });
  });
});
