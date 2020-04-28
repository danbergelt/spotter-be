import jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_EXPIRE } = process.env;

// generates an auth token

export const token = (id: string, tokenFactory = jwt): string => {
  return tokenFactory.sign({ id }, String(JWT_SECRET), {
    expiresIn: String(JWT_EXPIRE)
  });
};
