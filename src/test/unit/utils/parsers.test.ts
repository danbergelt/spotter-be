import { e, metadata, success, failure } from '../../../utils/parsers';
import assert from 'assert';
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

describe('email metadata builder', () => {
  it('builds metadata', () => {
    const result = metadata('foo', 'bar', 'baz', 'qux');
    assert.deepStrictEqual(result, { from: 'foo', to: 'bar', subject: 'baz', html: 'qux' });
  });
});

describe('error object', () => {
  it('returns an error', () => {
    const error = e('foo', 500);
    assert.deepStrictEqual(error, { message: 'foo', status: 500 });
  });
});
