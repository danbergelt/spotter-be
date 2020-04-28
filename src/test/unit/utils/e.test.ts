import { e } from '../../../utils/e';
import { expect } from 'chai';

describe('error object', () => {
  it('returns an error', () => {
    const error = e('foo', 500);
    expect(error).to.deep.equal({ message: 'foo', status: 500 });
  });
});
