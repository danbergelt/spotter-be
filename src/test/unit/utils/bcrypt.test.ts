import Sinon from 'sinon';
import { hash, compareHash } from '../../../utils/bcrypt';
import assert from 'assert';
import { right, left } from 'fp-ts/lib/TaskEither';

describe('hash a string', () => {
  it('successfully hash a string', async () => {
    const bc = { genSalt: Sinon.stub().returns('SALT'), hash: Sinon.stub().returns('ENCRYPTED') };
    const result = await hash('foo', bc as any)();
    const expected = await right('ENCRYPTED')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error when hash fails', async () => {
    const bc = {
      genSalt: Sinon.stub().throws('foo')
    };
    const result = await hash('foo', bc as any)();
    const expected = await left({ message: 'Server error', status: 500 })();
    assert.deepStrictEqual(result, expected);
  });
});

describe('verifies a hash', () => {
  it('verifies', async () => {
    const s = 'foo';
    const enc = 'bar';
    const bc = { compare: Sinon.stub().returns(true) };
    const result = await compareHash(s, enc, bc as any)();
    const expected = await right(true)();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error if lib errors', async () => {
    const s = 'foo';
    const enc = 'bar';
    const bc = { compare: Sinon.stub().throws('foo') };
    const result = await compareHash(s, enc, bc as any)();
    const expected = await left({ message: 'Server error', status: 500 })();
    assert.deepStrictEqual(result, expected);
  });

  it('returns false if values do not verify', async () => {
    const s = 'foo';
    const enc = 'bar';
    const bc = { compare: Sinon.stub().returns(false) };
    const result = await compareHash(s, enc, bc as any)();
    const expected = await right(false)();
    assert.deepStrictEqual(result, expected);
  });
});
