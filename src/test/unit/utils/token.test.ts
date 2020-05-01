import { token } from '../../../utils/token';
import Sinon from 'sinon';
import assert from 'assert';
import { ObjectId } from 'mongodb';

describe('token factory', () =>
  it('creates an auth token', () => {
    const jwt = { sign: Sinon.stub().returns('bar') };
    const result = token(new ObjectId(), jwt as any);
    assert.equal(result, 'bar');
  }));
