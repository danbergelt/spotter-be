import fns from '../../index.functions';
import Sinon from 'sinon';
import { expect } from 'chai';

describe('index helper functions', () => {
  it('logs a rejection', () => {
    const logged = fns.logRejection('foo', Sinon.stub().returnsArg(0));
    expect(logged).to.equal('foo');
  });

  it('closes the server', () => {
    const server = { close: Sinon.stub().callsArg(0) } as any;
    const process = { exit: Sinon.stub().returnsArg(0) } as any;
    const code = fns.closeServer(server, process);
    expect(code).to.equal(1);
    expect(server.close.calledOnce).to.be.true;
    expect(process.exit.calledOnce).to.be.true;
  });

  it('logs a message with the port and environment', () => {
    const logged = fns.success(Sinon.stub().returnsArg(0));
    expect(logged).to.equal('Port: 5000\nMode: test');
  });

  it('injects N middleware', () => {
    const a = { use: Sinon.stub() } as any;
    const mw = [1, 2, 3] as any;
    fns.inject(a, mw);
    expect(a.use.calledThrice).to.be.true;
  });
});
