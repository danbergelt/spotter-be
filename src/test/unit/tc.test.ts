import { tc } from '../../utils/tc';
import Sinon from 'sinon';
import { expect } from 'chai';

describe('try/catch wrapper for express functions', () => {
  it('tries', async () => {
    const next = Sinon.stub();
    const cb = () => Promise.resolve('foo');
    const resolved = await tc(next, cb);
    expect(resolved).to.equal('foo');
  });

  it('catches', async () => {
    const next = Sinon.stub();
    const cb = () => Promise.reject('foo');
    await tc(next, cb);
    expect(next.calledOnce).to.be.true;
  });
});
