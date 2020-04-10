import Sinon from 'sinon';
import { Mailgun, Messages } from 'mailgun-js';
import { sendMail } from '../../../../utils/sendMail';
import { expect } from 'chai';

describe('send mail', () => {
  it('calls the mailgun instance', async () => {
    const metadata = { from: 'foo', to: 'bar', subject: 'baz', html: 'qux' };
    const mg = {} as Mailgun;
    const messages = {} as Messages;
    mg.messages = Sinon.stub().returns(messages);
    messages.send = Sinon.stub().returnsArg(0);

    await sendMail(metadata, mg);
    expect((mg.messages as any).calledOnce).to.be.true;
    expect((messages.send as any).calledOnce).to.be.true;
  });
});
