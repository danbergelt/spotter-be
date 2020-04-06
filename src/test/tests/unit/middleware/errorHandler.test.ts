import Sinon from 'sinon';
import errorHandler from '../../../../middleware/errorHandler';
import { Request } from 'express';
import { expect } from 'chai';

const utils = (error = {}) => {
  const err = error;
  const req = {} as Request;
  const res = {} as any;
  const next = Sinon.stub();
  res.status = Sinon.stub().returnsThis();
  res.json = Sinon.stub().returnsArg(0);

  return { err, req, res, next };
};

describe('error handler middleware', () => {
  it('returns default error if passed-in error is not recognized', () => {
    const { err, req, res, next } = utils();
    expect(errorHandler(err, req, res, next).error).to.equal('Server error');
    expect(res.status.getCall(0).args[0]).to.equal(500);
  });

  it('returns a mongoose error if passed-in error is a mongoose error', () => {
    const { err, req, res, next } = utils({ name: 'CastError' });
    expect(errorHandler(err, req, res, next).error).to.equal(
      'Resource not found'
    );
    expect(res.status.getCall(0).args[0]).to.equal(404);
  });

  it('returns the error argument', () => {
    const { err, req, res, next } = utils({
      status: 123,
      message: 'foobar'
    });
    expect(errorHandler(err, req, res, next).error).to.equal('foobar');
    expect(res.status.getCall(0).args[0]).to.equal(123);
  });
});
