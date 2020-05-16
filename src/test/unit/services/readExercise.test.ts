import Sinon from 'sinon';
import { ObjectId } from 'mongodb';
import { readExercise } from '../../../services/readExercise';
import { right, left } from 'fp-ts/lib/TaskEither';
import assert from 'assert';

describe('read exercise from db', () => {
  it('reads an exercise', async () => {
    const exercise = { name: 'foo', user: new ObjectId() };
    const db = Sinon.stub().returns({ findOne: Sinon.stub().returns(exercise) });
    const result = await readExercise(db, exercise)();
    const expected = await right(exercise)();
    assert.deepStrictEqual(result, expected);
  });

  it('returns a bad gateway error on failure', async () => {
    const exercise = { name: 'foo', user: new ObjectId() };
    const db = Sinon.stub().returns({ findOne: Sinon.stub().throws('foo') });
    const result = await readExercise(db, exercise)();
    const expected = await left({ message: 'Bad gateway', status: 502 })();
    assert.deepStrictEqual(result, expected);
  });
});
