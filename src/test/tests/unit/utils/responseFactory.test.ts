import { mockRes } from 'sinon-express-mock';
import { responseFactory } from '../../../../utils/responseFactory';
import { expect } from 'chai';

describe('response factory', () => {
  it('builds and returns a JSON response', () => {
    const res = mockRes();
    const status = 200;
    const success = true;
    const data = { foo: 'bar' };
    responseFactory(res, status, success, data);
    expect(res.status.calledWith(status)).to.be.true;
    expect(res.json.calledWith({ success: true, ...data })).to.be.true;
  });
});
