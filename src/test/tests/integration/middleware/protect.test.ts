import express from 'express';
import { protect } from '../../../../middleware/protect';
import errorHandler from '../../../../middleware/error';
import chaiHttp from 'chai-http';
import { expect, use, request } from 'chai';
import { genToken } from '../../../..//test/utils/genToken';
import mongoose from 'mongoose';
import { createUser } from '../../../../test/utils/createUser';

use(chaiHttp);

const app = express();

app.get('/', protect(), (_, res) => {
  return res.sendStatus(200);
});

app.use(errorHandler);

describe('protect middleware integration tests', () => {
  it('errors if there is no authorization header', async () => {
    const res = await request(app).get('/');
    expect(res.body.error).to.equal('Access denied');
    expect(res.status).to.equal(401);
  });

  it('errors on malformed bearer syntax', async () => {
    const res = await request(app)
      .get('/')
      .set('Authorization', `Foo bar`);

    expect(res.body.error).to.equal('Access denied');
    expect(res.status).to.equal(401);
  });

  it('errors when token does not exist in header', async () => {
    const res = await request(app)
      .get('/')
      .set('Authorization', 'Bearer');
    expect(res.body.error).to.equal('Access denied');
    expect(res.status).to.equal(401);
  });

  it('errors when decoded token is malformed', async () => {
    const res = await request(app)
      .get('/')
      .set('Authorization', 'Bearer token');
    expect(res.body.error).to.equal('Access denied');
    expect(res.status).to.equal(401);
  });

  it('errors when decoded token is not a Mongo ObjectId', async () => {
    const token = genToken('token');
    const res = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.error).to.equal('Resource not found');
    expect(res.status).to.equal(401);
  });

  it('errors when decoded token id is not tied to a user document', async () => {
    const id = new mongoose.Types.ObjectId();
    const token = genToken(id.toHexString());
    const res = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.error).to.equal('User not found');
    expect(res.status).to.equal(401);
  });

  it('returns when the user passes authentication', async () => {
    const { id } = await createUser();
    const token = genToken(id);
    const res = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
  });
});
