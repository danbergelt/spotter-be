import Template from '../../models/Template';

export const createTemplate = async (template: any) => {
  await Template.deleteMany({});
  const temp = new Template(template);
  return await temp.save();
};
