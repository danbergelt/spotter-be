import Tag from '../../models/Tag';

export const createTag = async (id: string) => {
  await Tag.deleteMany({});
  const tag = new Tag({ color: 'red', content: 'test', user: id });
  return await tag.save();
};
