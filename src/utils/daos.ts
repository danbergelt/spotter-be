import { Document, Model } from 'mongoose'; // eslint-disable-line
import { Stage, UpdateMany, DeleteMany } from '../types';
import User from '../models/user';
import { User as UserInterface } from '../types/models';

/*== **IMPORTANT** =====================================================

Despite being async, these functions are deliberately not caught. This is
to encourage you to write more explicit error messages at a higher level,
and to match the relevant context

*/

/*== findById =====================================================

A DAO that finds a model according to an id

*/

export const findById = async <T extends Document>(
  Model: Model<T>,
  id: string
): Promise<T | null> => {
  return await Model.findById(id);
};

/*== findMany =====================================================

A DAO that bulk queries a collection to query documents that contain
a user as a foreign key

*/

export const findMany = async <T extends Document>(
  Model: Model<T>,
  user: string
): Promise<T[]> => {
  return await Model.find({ user });
};

/*== aggregate =====================================================

A DAO that aggregates a collection according to the provided stages

*/

export const aggregate = async <T extends Document, U>(
  Model: Model<T>,
  stages: Stage[]
): Promise<U[]> => {
  return await Model.aggregate(stages);
};

/*== updateOne =====================================================

A DAO that updates a document which matches the provided filter

*/

export const updateOne = async <T extends Document>(
  Model: Model<T>,
  filter: Stage,
  update: Stage
): Promise<T | null> => {
  return await Model.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
    context: 'query'
  });
};

/*== updateMany =====================================================

A DAO that updates many documents in a collection which match the
provided filter

*/

export const updateMany = async <T extends Document>(
  Model: Model<T>,
  filter: Stage,
  update: Stage
): Promise<UpdateMany> => {
  return await Model.updateMany(filter, update, {
    new: true,
    runValidators: true,
    context: 'query'
  });
};

/*== getPassword =====================================================

A DAO that fetches a password from a user document

*/

export const getPassword = async (
  id: string
): Promise<UserInterface | null> => {
  return await User.findById(id).select('+password');
};

/*== deleteOne =====================================================

A DAO that deletes a document by ID

*/

export const deleteOne = async <T extends Document>(
  Model: Model<T>,
  id: string
): Promise<T | null> => {
  return await Model.findByIdAndDelete(id);
};

/*== findOne =====================================================

A DAO that find's a single document according to a filter

*/

export const findOne = async <T extends Document>(
  Model: Model<T>,
  filter: Stage
): Promise<T | null> => {
  return await Model.findOne(filter);
};

/*== deleteMany =====================================================

A DAO that deletes many documents according to a filter

*/

export const deleteMany = async <T extends Document>(
  Model: Model<T>,
  filter: Stage
): Promise<DeleteMany> => {
  return await Model.deleteMany(filter);
};
