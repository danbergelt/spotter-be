import { sendError, sendAuth } from '../../../utils/http';
import { mockRes } from 'sinon-express-mock';
import { expect } from 'chai';
import { ObjectId } from 'mongodb';
import Sinon from 'sinon';
import assert from 'assert';

describe('auth response', () => {
  it('returns an auth response with a cookie and a token', () => {
    const _id = new ObjectId();
    const res = {
      cookie: Sinon.stub().returnsThis(),
      status: Sinon.stub().returnsThis(),
      json: Sinon.stub().returns('token')
    };

    sendAuth(_id, res as any);
    assert.ok(res.json.returned('token'));
  });
});

describe('error response function', () => {
  it('returns an error response', () => {
    const err = { message: 'foo', status: 500 };
    const res = mockRes();

    sendError(err, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ success: false, error: 'foo' })).to.be.true;
  });
});
