import * as jwt from 'jsonwebtoken';

export const genToken = (user: string) =>
  jwt.sign({ id: user }, process.env.JWT_SECRET!, { expiresIn: 60 * 60 });
