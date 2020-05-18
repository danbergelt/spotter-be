import { use, request } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/express';
import assert from 'assert';

use(http);

const p = path('/users')('/logout');

describe('logout', () => {
  it('logs user out', async () => {
    const res = await request(server).post(p);
    assert.ok(res.header['set-cookie'][0].startsWith('ref=;'));
  });
});
