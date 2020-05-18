import {
  e,
  parseWrite,
  parseDelete,
  metadata,
  success,
  failure,
  mongofy
} from '../../../utils/parsers';
import assert from 'assert';
import { ObjectId } from 'mongodb';
import { expect } from 'chai';
import { right, left } from 'fp-ts/lib/Either';

describe('mongofy an _id', () => {
  it('mongofies', () => {
    const result = mongofy('507f1f77bcf86cd799439011');
    const expected = right(new ObjectId('507f1f77bcf86cd799439011'));
    assert.deepStrictEqual(result, expected);
    assert.ok((result as any).right instanceof ObjectId);
  });

  it('returns an error if mongofication fails', () => {
    const result = mongofy('foo');
    const expected = left({ message: 'Invalid resource id', status: 400 });
    assert.deepStrictEqual(result, expected);
  });
});

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

describe('parse a mongodb delete operation', () => {
  it('parses', () => {
    const _id = new ObjectId();
    const result = parseDelete({ value: { foo: 'bar', _id }, ok: 1 });
    const expected = { foo: 'bar', _id };
    assert.deepStrictEqual(result, expected);
  });
});

describe('parse a mongo write', () => {
  it('returns the written object', () => {
    const write = parseWrite({ ops: ['foo'] } as any);
    assert.equal(write, 'foo');
  });
});

describe('error object', () => {
  it('returns an error', () => {
    const error = e('foo', 500);
    assert.deepStrictEqual(error, { message: 'foo', status: 500 });
  });
});
