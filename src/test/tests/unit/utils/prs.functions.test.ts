import {
  buildListOfExercises,
  buildListOfPotentialPrs,
  buildHashTableOfPrs,
  updateExercisesWithPrs
} from '../../../../utils/prs.functions';
import Sinon from 'sinon';
import { expect } from 'chai';

describe('pr functions', () => {
  it('builds a list of user exercises', async () => {
    const findExercises = Sinon.stub().returns([{ name: 'foo' }]);
    const exercises = await buildListOfExercises('fake', findExercises);
    expect(exercises).to.deep.equal(['foo']);
  });

  it('returns an empty array of exercises if no exercises found', async () => {
    const findExercises = Sinon.stub().returns([]);
    const exercises = await buildListOfExercises('fake', findExercises);
    expect(exercises).to.deep.equal([]);
  });

  it('returns workouts with exercises that contains a users saved exercises', async () => {
    const exercises = ['foo'];
    const aggregatePrs = Sinon.stub().returns([
      { exercises: { name: 'foo' } },
      { exercises: { name: 'bar' } }
    ]);
    const prs = await buildListOfPotentialPrs('fake', exercises, aggregatePrs);
    expect(prs.length).to.equal(1);
    expect(prs[0].exercises.name).to.equal('foo');
  });

  it('returns an empty array if a user has no workouts with any saved exercises', async () => {
    const exercises = ['foo'];
    const aggregatePrs = Sinon.stub().returns([{ exercises: { name: 'bar' } }]);
    const prs = await buildListOfPotentialPrs('fake', exercises, aggregatePrs);
    expect(prs.length).to.equal(0);
  });

  it('builds a hash table of prs', () => {
    const exercises = ['foo'];
    const prs = [
      { exercises: { name: 'foo', weight: 100 }, _id: 1, date: 'date 1' },
      { exercises: { name: 'foo', weight: 200 }, _id: 2, date: 'date 2' },
      { exercises: { name: 'foo', weight: 50 }, _id: 3, date: 'date 3' }
    ] as any;
    const ht = buildHashTableOfPrs(exercises, prs);
    expect(ht).to.deep.equal({ foo: [200, 'date 2'] });
  });

  it('ignores not-saved exercises when building the pr hash table', () => {
    const exercises = ['foo'];
    const prs = [
      { exercises: { name: 'bar', weight: 100 }, _id: 1, date: 'date 1' }
    ] as any;
    const ht = buildHashTableOfPrs(exercises, prs);
    expect('foo' in ht).to.be.true;
    expect('bar' in ht).to.be.false;
    expect(ht).to.deep.equal({ foo: [0, undefined] });
  });

  it('updates all exercises for passed in prs', async () => {
    const ht = { foo: 'bar', bar: 'baz' } as any;
    const updater = Sinon.stub();
    await updateExercisesWithPrs('fake', ht, updater);
    expect(updater.calledTwice).to.be.true;
  });
});
