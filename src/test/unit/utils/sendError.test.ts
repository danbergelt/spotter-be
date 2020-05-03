import { sendError } from '../../../utils/sendError';
import { mockRes } from 'sinon-express-mock';
import { expect } from 'chai';

describe('error response function', () => {
  it('returns an error response', () => {
    const err = { message: 'foo', status: 500 };
    const res = mockRes();

    sendError(err, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ success: false, error: 'foo' })).to.be.true;
  });
});
