import { sendMail } from '../../../services/sendMail';
import Sinon from 'sinon';
import assert from 'assert';
import { right, left } from 'fp-ts/lib/TaskEither';

describe('send mail', () => {
  it('returns void on successful send', async () => {
    const md = { foo: 'bar' } as any;
    const mg = { messages: Sinon.stub().returnsThis(), send: Sinon.stub() } as any;
    const result = await sendMail(md, mg)();
    const expected = await right(undefined)();
    assert.deepStrictEqual(result, expected);
  });

  it('returns a server error on failure', async () => {
    const md = { foo: 'bar' } as any;
    const mg = { messages: Sinon.stub().throws('foo') } as any;
    const result = await sendMail(md, mg)();
    const expected = await left({ message: 'Server error', status: 500 })();
    assert.deepStrictEqual(result, expected);
  });
});
