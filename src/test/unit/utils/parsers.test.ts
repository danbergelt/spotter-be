import { e, metadata, success, failure, parseRows, join, ternary } from '../../../utils/parsers';
import assert from 'assert';
import { expect } from 'chai';
import { right, left } from 'fp-ts/lib/Either';
import { right as r } from 'fp-ts/lib/TaskEither';

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

describe('parse rows', () => {
  it('parses rows from a db query', () => {
    const foo = parseRows({ message: 'foo', status: 500 })(['foo']);
    assert.deepStrictEqual(foo, right(['foo']));
  });

  it('returns the pre-loaded error if array is empty', () => {
    const foo = parseRows({ message: 'foo', status: 500 })([]);
    assert.deepStrictEqual(foo, left({ message: 'foo', status: 500 }));
  });
});

describe('join', () => {
  it('joins a task either with an either', async () => {
    const foo = await join(r('foo'))(() => right('bar'))();
    assert.deepStrictEqual(foo, await r('bar')());
  });
});

describe('ternary', () => {
  it('returns a if b is true', () => {
    const foo = ternary({ message: 'foo', status: 500 })('bar')(true);
    assert.deepStrictEqual(foo, right('bar'));
  });

  it('returns c if b is false', () => {
    const foo = ternary({ message: 'foo', status: 500 })('bar')(false);
    assert.deepStrictEqual(foo, left({ message: 'foo', status: 500 }));
  });
});
