import { ObjectId } from 'mongodb';
import Sinon from 'sinon';
import { auth } from '../../../utils/auth';
import assert from 'assert';

describe('auth response', () => {
  it('returns an auth response with a cookie and a token', async () => {
    const _id = new ObjectId();
    const res = {
      cookie: Sinon.stub().returnsThis(),
      status: Sinon.stub().returnsThis(),
      json: Sinon.stub().returns('token')
    };

    const result = await auth(_id, res as any)();
    assert.equal(result, undefined);
    assert.ok(res.json.returned('token'));
  });
});
