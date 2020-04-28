import { success } from '../../../utils/success';
import { expect } from 'chai';

describe('default success message for 200 http responses', () => {
  it('returns a success message', () => {
    const message = success({ foo: 'bar' });
    expect(message).to.deep.equal({ success: true, foo: 'bar' });
  });
});
