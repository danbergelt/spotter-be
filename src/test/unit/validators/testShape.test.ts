import { testShape } from '../../../validators/testShape';
import assert from 'assert';

describe('test an objects shape', () => {
  it('returns true on clean object', () => {
    const result = testShape({ foo: 'bar', bar: 'baz' }, { foo: true, bar: true });
    assert.ok(result);
  });

  it('returns false on a dirty object', () => {
    const result = testShape({ foo: 'bar', bar: 'baz' }, { foo: true, baz: true });
    assert.ok(!result);
  });
});
