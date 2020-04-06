import * as jwt from 'jsonwebtoken';

export const genToken = (user: string) => {
  return jwt.sign({ id: user }, process.env.JWT_SECRET as string, {
    expiresIn: 60 * 60
  });
};
