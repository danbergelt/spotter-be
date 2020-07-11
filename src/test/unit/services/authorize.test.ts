import { strip, inject } from '../../../services/authorize';
import assert from 'assert';
import { left, right } from 'fp-ts/lib/Either';
import { unauthorized } from '../../../utils/errors';

describe('token stripper', () => {
  it('returns an error if no header exists', async () => {
    const result = await strip(undefined)();
    const expected = left(unauthorized);
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error if the header is not a bearer', async () => {
    const result = await strip('foo')();
    const expected = left(unauthorized);
    assert.deepStrictEqual(result, expected);
  });

  it('strips the token', async () => {
    const result = await strip('Bearer foo')();
    const expected = right('foo');
    assert.deepStrictEqual(result, expected);
  });
});

describe('inject', () => {
  it('injects a user into the request body', () => {
    const result = inject({ body: { foo: 'bar' } } as any)({ id: 1 } as any);
    const expected = { foo: 'bar', user: 1 };
    assert.deepStrictEqual(result, expected);
  });
});
