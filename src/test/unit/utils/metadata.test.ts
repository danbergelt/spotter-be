import { metadata } from '../../../utils/metadata';
import assert from 'assert';

describe('email metadata builder', () => {
  it('builds metadata', () => {
    const result = metadata('foo', 'bar', 'baz', 'qux');
    assert.deepStrictEqual(result, { from: 'foo', to: 'bar', subject: 'baz', html: 'qux' });
  });
});
