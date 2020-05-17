import { parseDelete } from '../../../utils/parseDelete';
import { ObjectId } from 'mongodb';
import assert from 'assert';

describe('parse a mongodb delete operation', () => {
  it('parses', () => {
    const _id = new ObjectId();
    const result = parseDelete({ value: { foo: 'bar', _id }, ok: 1 });
    const expected = { foo: 'bar', _id };
    assert.deepStrictEqual(result, expected);
  });
});
