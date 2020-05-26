import Sinon from 'sinon';
import { expect } from 'chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { resolver, path } from '../../../utils/express';

describe('path factory', () => {
  it('builds a path', () => {
    expect(path('/foo')('/bar')).to.equal('/api/auth/foo/bar');
  });

  it('uses an empty string as default', () => {
    expect(path('/foo')()).to.equal('/api/auth/foo');
  });
});

const utils = () => {
  const req = mockReq();
  const res = mockRes();
  const next = Sinon.stub();
  return { req, res, next };
};

describe('async handler', () => {
  it('returns the function', () => {
    const fn = resolver(async (_req, _res, _next) => {
      await new Promise((resolve, _reject) => {
        setTimeout(() => resolve('foo'), 0);
      });
    });

    expect(fn).to.be.a('function');
  });

  it('resolves the promise', async () => {
    const { req, res, next } = utils();
    const fn = resolver(async (_req, res, _next) => {
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
    const fn = resolver(async (_req, _res, _next) => {
      await new Promise((_resolve, reject) => {
        setTimeout(() => reject('bar'), 0);
      });
    });

    await fn(req, res, next);

    expect(next.calledOnce).to.be.true;
  });
});
