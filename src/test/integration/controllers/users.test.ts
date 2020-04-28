import { use, request } from 'chai';
import http from 'chai-http';
import server from '../../../index';
import { path } from '../../../utils/path';

use(http);

const userPath = path('/users');

describe('registration', () => {
  it('can register', async () => {
    const res = await request(server)
      .post(userPath('/registration'))
      .send({ foo: 'bar' });
    console.log(res);
  });
});
