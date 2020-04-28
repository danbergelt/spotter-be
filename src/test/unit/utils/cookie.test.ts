import { cookie } from '../../../utils/cookie';
import Sinon from 'sinon';
import assert from 'assert';

describe('cookie setter', () => {
  it('returns cookie data to spread into res.cookie', () => {
    const jwt = { sign: Sinon.stub().returns('token') };
    const cookieData = cookie('foo', jwt as any, { foo: 'bar' } as any);
    assert.deepStrictEqual(cookieData, ['ref', 'token', { foo: 'bar' }]);
  });
});
