import { Model, Document, Schema } from 'mongoose';

// cascade update passed in model when a tag is deleted
type TTagCascadeDel = (
  id: Schema.Types.ObjectId,
  Model: Model<Document, {}>
) => Promise<void>;
export const tagCascadeDel: TTagCascadeDel = async (id, Model) => {
  await Model.updateMany(
    { tags: { $elemMatch: { _id: id } } },
    { $pull: { tags: { _id: id } } },
    { new: true }
  );
};

// cascade update passed in model when a tag is updated
type TTagCascadeUpdate = (
  id: Schema.Types.ObjectId,
  Model: Model<Document, {}>,
  content: string
) => Promise<void>;
export const tagCascadeUpdate: TTagCascadeUpdate = async (
  id,
  Model,
  content
) => {
  await Model.updateMany(
    { tags: { $elemMatch: { _id: id } } },
    {
      // set the new content
      $set: {
        'tags.$.content': content
      }
    },
    { new: true }
  );
};
