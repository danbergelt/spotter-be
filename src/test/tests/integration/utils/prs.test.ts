import { prs } from '../../../../utils/prs';
import { createUser } from '../../../../test/utils/createUser';
import Exercise from '../../../../models/Exercise';
import Workout from '../../../../models/Workout';
import { expect } from 'chai';
import { template } from '../../../../test/utils/templateWorkout';

describe('prs functionality', () => {
  let user: string;

  beforeEach(async () => {
    const { _id } = await createUser();
    user = _id;
    await Exercise.deleteMany({});
  });

  it('adds prs to saved exercises', async () => {
    await new Exercise({ name: template.exercises[0].name, user }).save();
    await new Exercise({ name: 'Foobar', user }).save();
    await new Workout({ ...template, user }).save();
    await new Workout({ ...template, user }).save();

    await prs(user);
    const Exercises = await Exercise.find({});
    expect(Exercises[0].pr).to.equal(100);
    expect(Exercises[0].prDate).to.equal('Jan 01 2020');
    expect(Exercises[1].pr).to.equal(0);
    expect(Exercises[1].prDate).to.equal(null);
  });

  it('only updates prs with weight greater than current pr', async () => {
    await new Exercise({ name: template.exercises[0].name, user }).save();
    await new Workout({ ...template, user }).save();
    await new Workout({
      ...template,
      exercises: [
        { name: template.exercises[0].name, weight: 99, reps: 1, sets: 1 }
      ],
      user
    }).save();

    await prs(user);
    const Exercises = await Exercise.find({});
    expect(Exercises[0].pr).to.equal(100);
  });

  it('retains original date when pr is matched', async () => {
    await new Exercise({ name: template.exercises[0].name, user }).save();
    await new Workout({ ...template, user }).save();
    await new Workout({ ...template, date: 'Jan 02 2020', user }).save();

    await prs(user);
    const Exercises = await Exercise.find({});
    expect(Exercises[0].prDate).to.equal('Jan 01 2020');
  });
});
