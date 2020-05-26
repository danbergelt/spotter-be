import { validate } from '../../../services/validate';
import { right, left } from 'fp-ts/lib/Either';
import assert from 'assert';
import { Errors } from 'io-ts';

describe('validator', () => {
  it('returns the original object on validation', () => {
    const object = { foo: 'bar' };
    const result = validate(right(object));
    assert.deepStrictEqual(result, right(object));
  });

  it('returns a validation error on failed validation', () => {
    const result = validate(left([{ message: 'foo' }] as Errors));
    assert.deepStrictEqual(result, left({ message: 'foo', status: 400 }));
  });
});
