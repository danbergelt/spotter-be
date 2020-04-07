import mongoose, { Schema, Query } from 'mongoose';
import Workout from './Workout';
import Template from './Template';
import { NextFunction } from 'connect';
import { Tag } from '../types/models';
import { cascadeDeleteTag, cascadeUpdateTag } from '../utils/cascades';

const TagSchema = new Schema<Tag>({
  color: {
    type: String,
    required: [true, 'Please add a tag color']
  },
  content: {
    type: String,
    maxlength: [20, '20 character max']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    immutable: true
  }
});

// cascade update tags
TagSchema.pre('findOneAndUpdate', async function(
  this: Query<Tag>,
  next: NextFunction
) {
  // get the specific document tied to the query
  const doc = (await this.findOne(this.getQuery())) as Tag;

  // extract the content in the update
  const { content } = this.getUpdate() as { content: string };

  if (content.length <= 20) {
    const params = { id: doc._id, update: content };
    // open a new update template query, match the id on each template to the specific doc's id
    await cascadeUpdateTag({ ...params, Model: Template });

    // open a new update workout query, match the id on each workout to the specific doc's id
    await cascadeUpdateTag({ ...params, Model: Workout });
  }

  next();
});

// cascade delete tags
TagSchema.pre('remove', async function(next) {
  // get the id off of the removed tag
  const id = this._id as Schema.Types.ObjectId;

  // loop through the workouts, pull the tags from the workout
  await cascadeDeleteTag({ id, Model: Workout });

  // loop through the templates, pull the tags from the template
  await cascadeDeleteTag({ id, Model: Template });

  next();
});

export default mongoose.model<Tag>('Tag', TagSchema);
