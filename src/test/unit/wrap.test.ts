import Sinon from 'sinon';
import { expect } from 'chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { wrap } from '../../utils/wrap';

const utils = () => {
  const req = mockReq();
  const res = mockRes();
  const next = Sinon.stub();
  res.status = Sinon.stub();
  return { req, res, next };
};

describe('async handler', () => {
  it('returns the function', () => {
    const fn = wrap(async (_req, _res, _next) => {
      await new Promise((resolve, _reject) => {
        setTimeout(() => resolve('foo'), 0);
      });
    });

    expect(fn).to.be.a('function');
  });

  it('resolves the promise', async () => {
    const { req, res, next } = utils();
    const fn = wrap(async (_req, res, _next) => {
      await new Promise((resolve, _reject) => {
        setTimeout(() => resolve('foo'), 0);
      });
      res.status(200);
    });

    await fn(req, res, next);

    expect(res.status.calledOnce).to.be.true;
  });

  it('rejects the promise', async () => {
    const { req, res, next } = utils();
    const fn = wrap(async (_req, _res, _next) => {
      await new Promise((_resolve, reject) => {
        setTimeout(() => reject('bar'), 0);
      });
    });

    await fn(req, res, next);

    expect(next.calledOnce).to.be.true;
  });
});
