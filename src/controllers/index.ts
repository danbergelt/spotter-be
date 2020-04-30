import express from 'express';
import { path } from '../utils/path';
import { validate } from '../middleware/validate';
import { SCHEMAS, schema } from '../validators';
import { login } from './users/login';
import { refresh } from './users/refresh';
import { registration } from './users/registration';
import { logout } from './users/logout';

const { USERS } = SCHEMAS;

const r = express.Router();
export const usersPath = path('/users');

r.post(usersPath('/login'), validate(schema(USERS)), login);
r.post(usersPath('/registration'), validate(schema(USERS)), registration);
r.post(usersPath('/refresh'), refresh);
r.post(usersPath('/logout'), logout);

export default r;
