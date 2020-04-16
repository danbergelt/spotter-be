import { useMongo } from '../../db/mongo';
import { expect, use } from 'chai';
import cap from 'chai-as-promised';
import Sinon from 'sinon';

use(cap);

describe('useMongo', () => {
  it('returns a function on successful db connection', async () => {
    const db = Sinon.stub();
    const connect = Sinon.stub().returns({ db });

    const test = await useMongo('foo', connect);
    expect(test).to.be.a('function');
  });

  it('throws an uncaught error if db connection fails', () => {
    console.error = Sinon.stub();
    const connect = Sinon.stub().throws();
    expect(useMongo('foo', connect)).to.eventually.throw();
  });
});
