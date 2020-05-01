import fns from '../../../index.functions';
import Sinon from 'sinon';
import { expect } from 'chai';

describe('index helper functions', () => {
  it('injects N middleware', () => {
    const a = { use: Sinon.stub() } as any;
    const fn = () => {};
    fns.inject(a)(fn, fn, fn);
    expect(a.use.calledThrice).to.be.true;
  });
});
