import { ObjectId } from 'mongodb';
import Sinon from 'sinon';
import { auth } from '../../../utils/auth';
import assert from 'assert';

describe('auth response', () => {
  it('returns an auth response with a cookie and a token', () => {
    const _id = new ObjectId();
    const res = {
      cookie: Sinon.stub().returnsThis(),
      status: Sinon.stub().returnsThis(),
      json: Sinon.stub().returns('token')
    };

    auth(_id, res as any);
    assert.ok(res.json.returned('token'));
  });
});
