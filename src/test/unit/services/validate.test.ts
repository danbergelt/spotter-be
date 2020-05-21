import { validate } from '../../../services/validate';
import Sinon from 'sinon';
import { right, left } from 'fp-ts/lib/Either';
import assert from 'assert';

describe('validator', () => {
  it('returns the original object on validation', () => {
    const object = { foo: 'bar' };
    const decoder = { decode: Sinon.stub().returns(right(object)) };
    const result = validate(decoder as any)(object);
    assert.deepStrictEqual(result, right(object));
  });

  it('returns a validation error on failed validation', () => {
    const object = { foo: 'bar' };
    const decoder = { decode: Sinon.stub().returns(left([{ message: 'foo' }])) };
    const result = validate(decoder as any)(object);
    assert.deepStrictEqual(result, left({ message: 'foo', status: 400 }));
  });
});
