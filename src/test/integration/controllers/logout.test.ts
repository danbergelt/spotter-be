import { use, request } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/path';
import assert from 'assert';

use(http);

const userPath = path('/users');

describe('logout', () => {
  it('logs user out', async () => {
    const res = await request(server).post(userPath('/logout'));
    assert.ok(res.header['set-cookie'][0].startsWith('ref=;'));
  });
});
