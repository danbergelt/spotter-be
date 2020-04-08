import assert from 'assert';
import { describe, beforeEach, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Workout from '../../../../models/Workout';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkout';

describe('Workout model update functionality', () => {
  beforeEach(async () => await Workout.deleteMany({}));

  beforeEach(async () => {
    const { _id } = await createUser();
    template.user = _id;
  });

  it('updates workout successfully', async () => {
    const workout = new Workout(template);
    await workout.save();
    await Workout.findOneAndUpdate(
      { date: 'Jan 01 2020' },
      { date: 'Jan 02 2020' }
    );
    const foo = await Workout.findOne({ date: 'Jan 02 2020' });
    assert(foo !== null);
  });

  it('updates a workout successfully by id', async () => {
    const workout = new Workout(template);
    await workout.save();
    await Workout.findByIdAndUpdate(workout._id, { date: 'Jan 02' });
    const foo = await Workout.findOne({ date: 'Jan 02' });
    assert(foo !== null);
  });

  it('cannot update a workout date to nothing', async () => {
    const workout = new Workout(template);
    await workout.save();
    await expect(
      Workout.findByIdAndUpdate(
        workout._id,
        { date: undefined },
        { runValidators: true, context: 'query' }
      )
    ).to.be.rejectedWith('Please add a date for this workout');
  });

  it('cannot update a workout date to invalid format', async () => {
    const workout = new Workout(template);
    await workout.save();
    await expect(
      Workout.findByIdAndUpdate(
        workout._id,
        { date: 'January 1st' },
        { runValidators: true, context: 'query' }
      )
    ).to.be.rejectedWith('Please add a valid date (Mmm DD YYYY)');
  });

  it('cannot update a workout title to nothing', async () => {
    const workout = new Workout(template);
    await workout.save();
    await expect(
      Workout.findByIdAndUpdate(
        workout._id,
        { title: undefined },
        { runValidators: true, context: 'query' }
      )
    ).to.be.rejectedWith('Please add a title');
  });

  it('cannot update a workout title to invalid length', async () => {
    const workout = new Workout(template);
    await workout.save();
    await expect(
      Workout.findByIdAndUpdate(
        workout._id,
        {
          title:
            'jfiowjfiowjfiowjceiowjeiowjfeiwofjewiofjeiwofjeiowfjewiofjeiowfjiowfjiowfjeiowfjwiofjwiofjiowefjiowjfiowfjiowjf'
        },
        { runValidators: true, context: 'query' }
      )
    ).to.be.rejectedWith('Title cannot be longer than 25 characters');
  });

  it('cannot update an exercise to nothing', async () => {
    const workout = new Workout(template);
    await workout.save();
    await expect(
      Workout.findByIdAndUpdate(
        workout._id,
        { exercises: [{ name: undefined }] },
        { runValidators: true, context: 'query' }
      )
    ).to.be.rejectedWith('Please add an exercise name');
  });

  it('cannot update an exercise to an invalid length', async () => {
    const workout = new Workout(template);
    await workout.save();
    await expect(
      Workout.findByIdAndUpdate(
        workout._id,
        {
          exercises: [
            {
              name:
                'jfiouwfjiowfjiowjfiowfjiowefjwiofjiowfjwioefjwiofjiowfjiowfjwiofjiowjfwiojfiowj'
            }
          ]
        },
        { runValidators: true, context: 'query' }
      )
    ).to.be.rejectedWith('25 character max');
  });

  it('cannot update an exercise with invalid metrics', async () => {
    const workout = new Workout(template);
    await workout.save();

    // weight
    await expect(
      Workout.findByIdAndUpdate(
        workout._id,
        { exercises: [{ ...template.exercises[0], weight: 2001 }] },
        { runValidators: true, context: 'query' }
      )
    ).to.be.rejectedWith('2000 lb limit');

    // sets
    await expect(
      Workout.findByIdAndUpdate(
        workout._id,
        { exercises: [{ ...template.exercises[0], sets: 2001 }] },
        { runValidators: true, context: 'query' }
      )
    ).to.be.rejectedWith('2000 sets limit');

    // reps
    await expect(
      Workout.findByIdAndUpdate(
        workout._id,
        { exercises: [{ ...template.exercises[0], reps: 2001 }] },
        { runValidators: true, context: 'query' }
      )
    ).to.be.rejectedWith('2000 reps limit');
  });
});
