import { Document, Model } from 'mongoose'; // eslint-disable-line

export const find = async <T extends Document>(
  Model: Model<T>,
  user: string
): Promise<Document[]> => {
  return await Model.find({ user });
};
