import { success, failure } from '../../../utils/httpResponses';
import { expect } from 'chai';

describe('success and failure messages', () => {
  it('returns a success message', () => {
    const message = success({ foo: 'bar' });
    expect(message).to.deep.equal({ success: true, foo: 'bar' });
  });

  it('returns a failure message', () => {
    const message = failure({ foo: 'bar' });
    expect(message).to.deep.equal({ success: false, foo: 'bar' });
  });
});
