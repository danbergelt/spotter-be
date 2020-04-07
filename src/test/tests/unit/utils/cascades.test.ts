import { createWorkout } from '../../../utils/createWorkout';
import { createUser } from '../../../utils/createUser';
import { createTag } from '../../../utils/createTag';
import { cascadeDeleteTag, cascadeUpdateTag } from '../../../../utils/cascades';
import Workout from '../../../../models/Workout';
import { expect } from 'chai';

const setup = async () => {
  const { _id } = await createUser();
  const tag = await createTag(_id);
  const { tags, _id: id } = await createWorkout({
    date: 'Jan 01 2020',
    title: 'Workout',
    user: _id,
    tags: [tag]
  });

  return { tags, id };
};

describe('mongo cascade operations', () => {
  it('cascade deletes a tag', async () => {
    const { tags, id } = await setup();

    expect(tags.length).to.equal(1);

    await cascadeDeleteTag({ id: tags[0]._id, Model: Workout });

    const workout = await Workout.findById(id);

    expect(workout?.tags.length).to.equal(0);
  });

  it('cascade updates a tag', async () => {
    const { tags, id } = await setup();

    expect(tags[0].content).to.equal('test');

    await cascadeUpdateTag({
      id: tags[0]._id,
      Model: Workout,
      update: 'updated!'
    });

    const workout = await Workout.findById(id);

    expect(workout?.tags[0].content).to.equal('updated!');
  });
});
