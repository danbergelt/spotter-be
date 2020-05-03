import Sinon from 'sinon';
import { verifyEncryption, verifyJwt } from '../../../utils/verifiers';
import assert from 'assert';
import { right, left } from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';

describe('verifies a JWT', () => {
  it('verifies', () => {
    const s = 'foo';
    const secret = 'bar';
    const verify = Sinon.stub().returns('baz');
    const result = verifyJwt(s, secret, verify);
    const expected = E.right('baz');
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error if token cannot be verified', () => {
    const s = 'foo';
    const secret = 'bar';
    const verify = Sinon.stub().throws('baz');
    const result = verifyJwt(s, secret, verify);
    const expected = E.left({ message: 'Unauthorized', status: 401 });
    assert.deepStrictEqual(result, expected);
  });
});

describe('verifies an encrypted value against non-encrypted value', () => {
  it('verifies', async () => {
    const s = 'foo';
    const enc = 'bar';
    const bc = { compare: Sinon.stub().returns(true) };
    const result = await verifyEncryption(s, enc, bc as any)();
    const expected = await right(true)();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error if encryption lib errors', async () => {
    const s = 'foo';
    const enc = 'bar';
    const bc = { compare: Sinon.stub().throws('foo') };
    const result = await verifyEncryption(s, enc, bc as any)();
    const expected = await left({ message: 'Server error', status: 500 })();
    assert.deepStrictEqual(result, expected);
  });

  it('returns false if values do not verify', async () => {
    const s = 'foo';
    const enc = 'bar';
    const bc = { compare: Sinon.stub().returns(false) };
    const result = await verifyEncryption(s, enc, bc as any)();
    const expected = await right(false)();
    assert.deepStrictEqual(result, expected);
  });
});
