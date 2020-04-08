import { request, use, expect } from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import errorHandler from '../../../../middleware/errorHandler';
import User from '../../../../models/user';
import HttpError from '../../../../utils/HttpError';

use(chaiHttp);

const app = express();

app.get('/foo', (_req, _res, next) => {
  return next(new Error());
});

app.get('/bar', (_req, _res, next) => {
  return User.findById('foobar', err => {
    next(err);
  });
});

app.get('/qux', (_req, _res, next) => {
  return next(new HttpError('foobar', 400));
});

app.use(errorHandler);

describe('error handler middleware', () => {
  it('returns a default error when error object is malformed', async () => {
    const res = await request(app).get('/foo');
    expect(res.status).to.equal(500);
    expect(res.body.error).to.equal('Server error');
  });

  it('returns a mongoose error when error object is a mongoose error', async () => {
    const res = await request(app).get('/bar');
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('Resource not found');
  });

  it('returns the passed-in error as is', async () => {
    const res = await request(app).get('/qux');
    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal('foobar');
  });
});
