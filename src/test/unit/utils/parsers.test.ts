import { e, success, failure, pluck } from '../../../utils/parsers';
import assert from 'assert';
import { right, left } from 'fp-ts/lib/Either';

describe('success and failure messages', () => {
  it('returns a success message', () => {
    const result = success({ foo: 'bar' });
    assert.deepStrictEqual(result, { success: true, foo: 'bar' });
  });

  it('returns a failure message', () => {
    const result = failure({ foo: 'bar' });
    assert.deepStrictEqual(result, { success: false, foo: 'bar' });
  });
});

describe('error object', () => {
  it('returns an error', () => {
    const error = e('foo', 500);
    assert.deepStrictEqual(error, { message: 'foo', status: 500 });
  });
});

describe('pluck', () => {
  it('plucks the head from an array', () => {
    const result = pluck(e('foo', 500))(['foo', 'bar']);
    assert.deepStrictEqual(result, right('foo'));
  });

  it('returns an error if the array is empty', () => {
    const result = pluck(e('foo', 500))([]);
    assert.deepStrictEqual(result, left({ message: 'foo', status: 500 }));
  });
});
