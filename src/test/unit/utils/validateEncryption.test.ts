import Sinon from 'sinon';
import { validateEncryption } from '../../../utils/validateEncryption';
import assert from 'assert';
import { right, left } from 'fp-ts/lib/TaskEither';

describe('validates an encrypted value against non-encrypted value', () => {
  it('validates', async () => {
    const s = 'foo';
    const enc = 'bar';
    const bc = { compare: Sinon.stub().returns(true) };
    const result = await validateEncryption(s, enc, bc as any)();
    const expected = await right(true)();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error if encryption lib errors', async () => {
    const s = 'foo';
    const enc = 'bar';
    const bc = { compare: Sinon.stub().throws('foo') };
    const result = await validateEncryption(s, enc, bc as any)();
    const expected = await left({ message: 'Server error', status: 500 })();
    assert.deepStrictEqual(result, expected);
  });

  it('returns false if values do not validate', async () => {
    const s = 'foo';
    const enc = 'bar';
    const bc = { compare: Sinon.stub().returns(false) };
    const result = await validateEncryption(s, enc, bc as any)();
    const expected = await right(false)();
    assert.deepStrictEqual(result, expected);
  });
});
