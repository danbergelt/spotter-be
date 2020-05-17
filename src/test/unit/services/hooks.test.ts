import { hooks } from '../../../services/hooks';
import { COLLECTIONS } from '../../../utils/constants';
import Sinon from 'sinon';
import { ObjectId } from 'mongodb';
import { right, left } from 'fp-ts/lib/TaskEither';
import assert from 'assert';

const { readOne, readMany, deleteOne, createOne } = hooks(COLLECTIONS.USERS);
const _id = new ObjectId();

describe('database hooks', () => {
  it('deletes one', async () => {
    const db = Sinon.stub().returns({ findOneAndDelete: Sinon.stub().returns('foo') });
    const result = await deleteOne(db, { _id })();
    const expected = await right('foo')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns bad gateway error if delete one fails', async () => {
    const db = Sinon.stub().returns({ findOneAndDelete: Sinon.stub().throws('foo') });
    const result = await deleteOne(db, { _id })();
    const expected = await left({ message: 'Bad gateway', status: 502 })();
    assert.deepStrictEqual(result, expected);
  });

  it('reads one', async () => {
    const db = Sinon.stub().returns({ findOne: Sinon.stub().returns('foo') });
    const result = await readOne(db, { _id })();
    const expected = await right('foo')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns bad gateway error if read one fails', async () => {
    const db = Sinon.stub().returns({ findOne: Sinon.stub().throws('foo') });
    const result = await readOne(db, { _id })();
    const expected = await left({ message: 'Bad gateway', status: 502 })();
    assert.deepStrictEqual(result, expected);
  });

  it('reads many', async () => {
    const db = Sinon.stub().returns({
      find: Sinon.stub().returns({ toArray: Sinon.stub().returns('foo') })
    });
    const result = await readMany(db, { _id })();
    const expected = await right('foo')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns bad gateway if read many fails', async () => {
    const db = Sinon.stub().returns({
      find: Sinon.stub().returns({ toArray: Sinon.stub().throws('foo') })
    });
    const result = await readMany(db, { _id })();
    const expected = await left({ message: 'Bad gateway', status: 502 })();
    assert.deepStrictEqual(result, expected);
  });

  it('creates one', async () => {
    const db = Sinon.stub().returns({ insertOne: Sinon.stub().returns('foo') });
    const result = await createOne(db, { _id })();
    const expected = await right('foo')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns bad gateway if create one fails', async () => {
    const db = Sinon.stub().returns({ createOne: Sinon.stub().throws('foo') });
    const result = await createOne(db, { _id })();
    const expected = await left({ message: 'Bad gateway', status: 502 })();
    assert.deepStrictEqual(result, expected);
  });
});
