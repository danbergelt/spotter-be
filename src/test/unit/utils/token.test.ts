import { token } from '../../../utils/token';
import Sinon from 'sinon';
import assert from 'assert';

describe('token factory', () =>
  it('creates an auth token', () => {
    const jwt = { sign: Sinon.stub().returns('bar') };
    const result = token('foo', jwt as any);
    assert.equal(result, 'bar');
  }));
