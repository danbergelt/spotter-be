import Sinon from 'sinon';
import { createExercise } from '../../../services/createExercise';
import { right, left } from 'fp-ts/lib/TaskEither';
import assert from 'assert';
import { ObjectId } from 'mongodb';

describe('create an exercise', () => {
  it('creates an exercise', async () => {
    const exercise = { name: 'foo', user: new ObjectId() };
    const db = Sinon.stub().returns({ insertOne: Sinon.stub().returns(exercise) });
    const result = await createExercise(db, exercise)();
    const expected = await right(exercise)();
    assert.deepStrictEqual(result, expected);
  });

  it('returns a gateway error on failure', async () => {
    const exercise = { name: 'foo', user: new ObjectId() };
    const db = Sinon.stub().returns({ insertOne: Sinon.stub().throws('foo') });
    const result = await createExercise(db, exercise)();
    const expected = await left({ message: 'Bad gateway', status: 502 })();
    assert.deepStrictEqual(result, expected);
  });
});
