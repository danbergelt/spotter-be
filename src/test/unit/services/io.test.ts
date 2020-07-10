import { mapError, io } from '../../../services/io';
import assert from 'assert';
import { Errors, string } from 'io-ts';
import { validationError } from '../../../utils/errors';
import { e } from '../../../utils/parsers';
import { left, right } from 'fp-ts/lib/Either';

describe('error mapper', () => {
  it('returns a generic error if no error message exists', () => {
    const result = mapError([{}] as Errors);
    const expected = validationError;
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error with the error message if provided', () => {
    const result = mapError([{ message: 'foo' }] as Errors);
    const expected = e('foo', 400);
    assert.deepStrictEqual(result, expected);
  });
});

describe('decoder', () => {
  it('returns an error if decoder fails', async () => {
    const result = await io(string)(1)();
    const expected = left(validationError);
    assert.deepStrictEqual(result, expected);
  });

  it('returns the data as a right if decoder succeeds', async () => {
    const result = await io(string)('foo')();
    const expected = right('foo');
    assert.deepStrictEqual(result, expected);
  });
});
