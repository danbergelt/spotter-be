import { mockRes, mockReq } from 'sinon-express-mock';
import Sinon from 'sinon';
import { fallback } from '../../../middleware/fallback';
import { expect } from 'chai';

describe('error handling middleware', () => {
  it('returns a fallback error response', () => {
    const err = {};
    const res = mockRes();
    const req = mockReq() as any;
    const next = Sinon.stub();

    fallback(err, req, res, next);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ success: false, error: 'Server error' })).to.be.true;
  });
});
