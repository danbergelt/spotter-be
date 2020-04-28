import { mockRes, mockReq } from 'sinon-express-mock';
import Sinon from 'sinon';
import { error } from '../../../middleware/error';
import { expect } from 'chai';

describe('error handling middleware', () => {
  it('returns an error response with a valid error argument', () => {
    const err = { message: 'foo', status: 500 };
    const res = mockRes();
    const req = mockReq() as any;
    const next = Sinon.stub();

    error(err, req, res, next);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ success: false, error: 'foo' })).to.be.true;
  });

  it('returns a default error response with an invalid error argument', () => {
    const err = { foo: 'bar', bar: 400 };
    const res = mockRes();
    const req = mockReq() as any;
    const next = Sinon.stub();

    error(err, req, res, next);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ success: false, error: 'Server error' })).to.be.true;
  });
});
