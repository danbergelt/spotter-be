import { Fn } from 'src/utils/wrap.types';
import { wrap } from 'src/utils/wrap';

export const register: Fn = async (req, res, next) => {
  next();
};
