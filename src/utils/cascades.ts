import {
  Cascade,
  DefaultCascadeParams,
  CascadeUpdateParams
} from '../types/index';

/*== cascaders =====================================================

Since MongoDB is natively non-relational, cascades must be written
out by hand. 

Tags, which technically have a many-to-many relationship,
are saved as subdocuments in a workout in addition to having
their own collection.

The decision to keep a tag's content and color in the workout is
optional, and used to simplify the database query for fetching a workout.
One could just keep the id as a foreign key, and perform a $lookup
to fetch the foreign fields.

The below cascades match tags on a given model by a tag's id,
and then either $pull that tag to delete it, or $set it using
the '$' positional operator. Both operations run as middleware

*/

// cascade update a document when a tag is deleted
export const cascadeDeleteTag: Cascade<DefaultCascadeParams> = async params => {
  const { Model, id } = params;

  await Model.updateMany(
    { tags: { $elemMatch: { _id: id } } },
    { $pull: { tags: { _id: id } } }
  );
};

// cascade update a document when a tag is updated
export const cascadeUpdateTag: Cascade<CascadeUpdateParams> = async params => {
  const { Model, id, update } = params;

  await Model.updateMany(
    { tags: { $elemMatch: { _id: id } } },
    {
      $set: {
        'tags.$.content': update
      }
    }
  );
};
