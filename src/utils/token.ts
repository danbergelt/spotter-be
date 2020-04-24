import jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_EXPIRE } = process.env;

export const token = (id: string): string => {
  return jwt.sign({ id }, String(JWT_SECRET), {
    expiresIn: String(JWT_EXPIRE)
  });
};
