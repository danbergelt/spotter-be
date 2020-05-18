import { token, cookie, verifyJwt } from '../../../utils/jwt';
import Sinon from 'sinon';
import assert from 'assert';
import { ObjectId } from 'mongodb';
import { right, left } from 'fp-ts/lib/Either';

describe('verifies a JWT', () => {
  it('verifies', () => {
    const s = 'foo';
    const secret = 'bar';
    const verify = Sinon.stub().returns('baz');
    const result = verifyJwt(s, secret, verify);
    const expected = right('baz');
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error if token cannot be verified', () => {
    const s = 'foo';
    const secret = 'bar';
    const verify = Sinon.stub().throws('baz');
    const result = verifyJwt(s, secret, verify);
    const expected = left({ message: 'Unauthorized', status: 401 });
    assert.deepStrictEqual(result, expected);
  });
});

describe('token factory', () =>
  it('creates an auth token', () => {
    const jwt = { sign: Sinon.stub().returns('bar') };
    const result = token(new ObjectId(), jwt as any);
    assert.equal(result, 'bar');
  }));

describe('cookie setter', () => {
  it('returns cookie data to spread into res.cookie', () => {
    const jwt = { sign: Sinon.stub().returns('token') };
    const cookieData = cookie(new ObjectId(), jwt as any, { foo: 'bar' } as any);
    assert.deepStrictEqual(cookieData, ['ref', 'token', { foo: 'bar' }]);
  });
});
