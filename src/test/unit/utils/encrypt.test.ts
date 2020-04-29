import { encrypt } from '../../../utils/encrypt';
import Sinon from 'sinon';
import { right, left } from 'fp-ts/lib/TaskEither';
import assert from 'assert';

describe('encrypt a string', () => {
  it('successfully encrypts a string', async () => {
    const bc = { genSalt: Sinon.stub().returns('SALT'), hash: Sinon.stub().returns('ENCRYPTED') };
    const result = await encrypt('foo', bc as any)();
    const expected = await right('ENCRYPTED')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error when encryption fails', async () => {
    const bc = {
      genSalt: Sinon.stub().throws('foo')
    };
    const result = await encrypt('foo', bc as any)();
    const expected = await left({ message: 'Server error', status: 500 })();
    assert.deepStrictEqual(result, expected);
  });
});
