import mongoose, { Schema, Query } from 'mongoose';
import Workout from './Workout';
import Template from './Template';
import { NextFunction } from 'connect';
import { Tag } from '../types/models';
import { tagCascadeDel, tagCascadeUpdate } from '../utils/cascades';

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
  const doc: Tag = await this.findOne(this.getQuery());

  // extract the content in the update
  const { content }: { content: string } = this.getUpdate();

  if (content.length <= 20) {
    // open a new update template query, match the id on each template to the specific doc's id
    await tagCascadeUpdate(doc._id, Template, content);

    // open a new update workout query, match the id on each workout to the specific doc's id
    await tagCascadeUpdate(doc._id, Workout, content);
  }

  next();
});

// cascade delete tags
TagSchema.pre('remove', async function(next) {
  // get the id off of the removed tag
  const tagId: Schema.Types.ObjectId = this._id;

  // loop through the workouts, pull the tags from the workout
  await tagCascadeDel(tagId, Workout);

  // loop through the templates, pull the tags from the template
  await tagCascadeDel(tagId, Template);

  next();
});

export default mongoose.model<Tag>('Tag', TagSchema);
