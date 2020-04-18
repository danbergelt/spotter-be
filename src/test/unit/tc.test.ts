import { tc } from '../../utils/tc';
import Sinon from 'sinon';
import { expect } from 'chai';

describe('try/catch wrapper for express functions', () => {
  it('tries', async () => {
    const cb = () => Promise.resolve('foo');
    const resolved = await tc(cb)(_ => {});
    expect(resolved).to.equal('foo');
  });

  it('catches', async () => {
    const next = Sinon.stub();
    const cb = () => Promise.reject(new Error('foo'));
    await tc(cb)(error => next(error));
    expect(next.calledWith('foo')).to.be.true;
  });
});
