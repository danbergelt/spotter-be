import assert from 'assert';
import { describe, beforeEach, it } from 'mocha';
import chai from 'chai';
const expect = chai.expect;
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import Template from '../../../../models/Template';
import { createUser } from '../../../utils/createUser';
import { template } from '../../../utils/templateWorkoutTemplate';

describe('template model creation', () => {
  beforeEach(async () => await Template.deleteMany({}));

  beforeEach(async () => {
    const { _id } = await createUser();
    template.user = _id;
  });

  it('creates a template workout', async () => {
    const temp = new Template(template);
    await temp.save();
    assert(!temp.isNew);
  });

  it('cannot create template with no name', async () => {
    const temp = new Template({ ...template, name: undefined });
    await expect(temp.save()).to.be.rejectedWith('Give your template a name');
  });

  it('cannot create long name', async () => {
    const temp = new Template({
      ...template,
      name:
        'kfiopwjciowcjiowcjiowcjiojciowjfiowjciojwiofjweiofjeiowjfioecnionconco2cho'
    });
    await expect(temp.save()).to.be.rejectedWith('20 character max');
  });

  it('cannot create long title', async () => {
    const temp = new Template({
      ...template,
      title:
        'kfiopwjciowcjiowcjiowcjiojciowjfiowjciojwiofjweiofjeiowjfioecnionconco2cho'
    });
    await expect(temp.save()).to.be.rejectedWith(
      'Title cannot be longer than 25 characters'
    );
  });

  it('cannot create exercise with no name', async () => {
    const temp = new Template({
      ...template,
      exercises: [
        {
          name: undefined
        }
      ]
    });
    await expect(temp.save()).to.be.rejectedWith('Please add an exercise name');
  });

  it('cannot create exercise with long name', async () => {
    const temp = new Template({
      ...template,
      exercises: [
        {
          name: 'kiojkiojiojiohiughuygtyftydfrtdrtsrtdrtdftufyugiuhuh'
        }
      ]
    });
    await expect(temp.save()).to.be.rejectedWith('25 character max');
  });

  it('cannot create exercise with large values', async () => {
    // weight
    let temp = new Template({
      ...template,
      exercises: [
        {
          ...template.exercises[0],
          weight: 2001
        }
      ]
    });
    await expect(temp.save()).to.be.rejectedWith('2000 lb limit');

    // sets
    temp = new Template({
      ...template,
      exercises: [
        {
          ...template.exercises[0],
          sets: 2001
        }
      ]
    });
    await expect(temp.save()).to.be.rejectedWith('2000 sets limit');

    // reps
    temp = new Template({
      ...template,
      exercises: [
        {
          ...template.exercises[0],
          reps: 2001
        }
      ]
    });
    await expect(temp.save()).to.be.rejectedWith('2000 reps limit');
  });
});
