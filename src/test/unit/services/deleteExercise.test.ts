import { deleteExercise } from '../../../services/deleteExercise';
import Sinon from 'sinon';
import { right } from 'fp-ts/lib/TaskEither';
import assert from 'assert';

describe('delete an exercise', () => {
  it('deletes an exercise and returns the deleted document', async () => {
    const exercise = { foo: 'bar' } as any;
    const db = Sinon.stub().returns({ findOneAndDelete: Sinon.stub().returns(exercise) });
    const result = await deleteExercise(db, exercise)();
    const expected = await right(exercise)();
    assert.deepStrictEqual(result, expected);
  });
});
