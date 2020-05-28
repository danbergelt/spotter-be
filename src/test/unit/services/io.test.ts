import { io } from '../../../services/io';
import { right, left } from 'fp-ts/lib/Either';
import assert from 'assert';
import { Errors } from 'io-ts';
import Sinon from 'sinon';

describe('validator', () => {
  it('returns the original object on validation', async () => {
    const object = { foo: 'bar' };
    const decoder = { decode: Sinon.stub().returns(right(object)) };
    const result = await io(decoder as any, object)();
    assert.deepStrictEqual(result, right(object));
  });

  it('returns a validation error on failed validation', async () => {
    const decoder = { decode: Sinon.stub().returns(left([{ message: 'foo' }] as Errors)) };
    const result = await io(decoder as any, 'foo')();
    assert.deepStrictEqual(result, left({ message: 'foo', status: 400 }));
  });
});
