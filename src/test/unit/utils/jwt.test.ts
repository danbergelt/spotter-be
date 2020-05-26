import { token, verifyJwt } from '../../../utils/jwt';
import Sinon from 'sinon';
import assert from 'assert';
import { right, left } from 'fp-ts/lib/Either';

describe('verifies a JWT', () => {
  it('verifies', () => {
    const s = 'foo';
    const secret = 'bar';
    const verify = Sinon.stub().returns('baz');
    const result = verifyJwt(secret, verify)(s);
    const expected = right('baz');
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error if token cannot be verified', () => {
    const s = 'foo';
    const secret = 'bar';
    const verify = Sinon.stub().throws('baz');
    const result = verifyJwt(secret, verify)(s);
    const expected = left({ message: 'Unauthorized', status: 401 });
    assert.deepStrictEqual(result, expected);
  });
});

describe('token factory', () =>
  it('creates an auth token', () => {
    const jwt = { sign: Sinon.stub().returns('bar') };
    const result = token(1, 'foo', 'bar', jwt as any);
    assert.equal(result, 'bar');
  }));
