import assert from 'assert';
import { describe, beforeEach, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Workout from '../../../../models/Workout';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkout';

describe('Workout model creation', () => {
  beforeEach(async () => await Workout.deleteMany({}));

  beforeEach(async () => {
    const { _id } = await createUser();
    template.user = _id;
  });

  it('creates a workout', async () => {
    const workout = new Workout(template);
    await workout.save();
    assert(!workout.isNew);
  });

  it('cannot create workout with no date', async () => {
    const workout = new Workout({ ...template, date: undefined });
    await expect(workout.save()).to.be.rejectedWith(
      'Please add a date for this workout'
    );
  });

  it('cannot create with invalid date format', async () => {
    const workout = new Workout({ ...template, date: 'January 1st' });
    await expect(workout.save()).to.be.rejectedWith(
      'Please add a valid date (Mmm DD YYYY)'
    );
  });

  it('cannot create long title', async () => {
    const workout = new Workout({
      ...template,
      title:
        'kfiopwjciowcjiowcjiowcjiojciowjfiowjciojwiofjweiofjeiowjfioecnionconco2cho'
    });
    await expect(workout.save()).to.be.rejectedWith(
      'Title cannot be longer than 25 characters'
    );
  });

  it('cannot create exercise with no name', async () => {
    const workout = new Workout({
      ...template,
      exercises: [
        {
          name: undefined
        }
      ]
    });
    await expect(workout.save()).to.be.rejectedWith(
      'Please add an exercise name'
    );
  });

  it('cannot create exercise with long name', async () => {
    const workout = new Workout({
      ...template,
      exercises: [
        {
          name: 'kiojkiojiojiohiughuygtyftydfrtdrtsrtdrtdftufyugiuhuh'
        }
      ]
    });
    await expect(workout.save()).to.be.rejectedWith('25 character max');
  });

  it('cannot create exercise with large values', async () => {
    // weight
    let workout = new Workout({
      ...template,
      exercises: [
        {
          ...template.exercises[0],
          weight: 2001
        }
      ]
    });
    await expect(workout.save()).to.be.rejectedWith('2000 lb limit');

    // sets
    workout = new Workout({
      ...template,
      exercises: [
        {
          ...template.exercises[0],
          sets: 2001
        }
      ]
    });
    await expect(workout.save()).to.be.rejectedWith('2000 sets limit');

    // reps
    workout = new Workout({
      ...template,
      exercises: [
        {
          ...template.exercises[0],
          reps: 2001
        }
      ]
    });
    await expect(workout.save()).to.be.rejectedWith('2000 reps limit');
  });
});
