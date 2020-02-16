import assert from 'assert';
import { describe, beforeEach, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Template from '../../../../models/Template';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkoutTemplate';

describe('template model edit', () => {
  beforeEach(async () => await Template.deleteMany({}));

  beforeEach(async () => {
    const { _id } = await createUser();
    template.user = _id;
  });

  it('updates template successfully', async () => {
    const temp = new Template(template);
    await temp.save();
    await Template.findByIdAndUpdate(
      temp._id,
      {
        name: 'Edited Template Name'
      },
      { runValidators: true }
    );
    const foo = await Template.findOne({ name: 'Edited Template Name' });
    assert(foo !== null);
  });

  it('cannot update template name to nothing', async () => {
    const temp = new Template(template);
    await temp.save();
    await expect(
      Template.findByIdAndUpdate(
        temp._id,
        { name: undefined },
        { runValidators: true }
      )
    ).to.be.rejectedWith('Give your template a name');
  });

  it('cannot update to long name', async () => {
    const temp = new Template(template);
    await temp.save();
    await expect(
      Template.findByIdAndUpdate(
        temp._id,
        { name: 'jkiopjiojiohjiojiowjfiojwioghiuwegiuhfoqwjfpqjfp' },
        { runValidators: true }
      )
    ).to.be.rejectedWith('20 character max');
  });

  it('cannot update to long title', async () => {
    const temp = new Template(template);
    await temp.save();
    await expect(
      Template.findByIdAndUpdate(
        temp._id,
        {
          title:
            'jkiopjiojiohjiojiowjfiojwioghiuwegiuhfoqwjfpqjfpfwfoijiojviowchjniojcniownvwiofhqwiofjpqwofjp'
        },
        { runValidators: true }
      )
    ).to.be.rejectedWith('Title cannot be longer than 25 characters');
  });

  it('cannot update exercise to long name', async () => {
    const temp = new Template(template);
    await temp.save();
    await expect(
      Template.findByIdAndUpdate(
        temp._id,
        {
          exercises: {
            name: 'fjeiowfjiowfjiowjfiowjfiowjfiowjiowjfeiowfjwiofjeiowfjiow'
          }
        },
        { runValidators: true }
      )
    ).to.be.rejectedWith('25 character max');
  });

  it('cannot update exercise to no name', async () => {
    const temp = new Template(template);
    await temp.save();
    await expect(
      Template.findByIdAndUpdate(
        temp._id,
        {
          exercises: {
            name: undefined
          }
        },
        { runValidators: true }
      )
    ).to.be.rejectedWith('Please add an exercise name');
  });

  it('cannot update an exercise with invalid metrics', async () => {
    const temp = new Template(template);
    await temp.save();

    // weight
    await expect(
      Template.findByIdAndUpdate(
        temp._id,
        { exercises: [{ ...template.exercises[0], weight: 2001 }] },
        { runValidators: true }
      )
    ).to.be.rejectedWith('2000 lb limit');

    // sets
    await expect(
      Template.findByIdAndUpdate(
        temp._id,
        { exercises: [{ ...template.exercises[0], sets: 2001 }] },
        { runValidators: true }
      )
    ).to.be.rejectedWith('2000 sets limit');

    // reps
    await expect(
      Template.findByIdAndUpdate(
        temp._id,
        { exercises: [{ ...template.exercises[0], reps: 2001 }] },
        { runValidators: true }
      )
    ).to.be.rejectedWith('2000 reps limit');
  });
});
