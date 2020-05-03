import { mongoify } from '../../../utils/mongoify';
import assert from 'assert';
import { right, left } from 'fp-ts/lib/Either';
import { ObjectId } from 'mongodb';

describe('mongoify an _id', () => {
  it('mongoifies', () => {
    const result = mongoify('507f1f77bcf86cd799439011');
    const expected = right(new ObjectId('507f1f77bcf86cd799439011'));
    assert.deepStrictEqual(result, expected);
    assert.ok((result as any).right instanceof ObjectId);
  });

  it('returns an error if mongoification fails', () => {
    const result = mongoify('foo');
    const expected = left({ message: 'Invalid ObjectId', status: 400 });
    assert.deepStrictEqual(result, expected);
  });
});
