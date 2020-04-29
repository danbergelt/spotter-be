import { Req } from '../types';
import { Email, Password } from '../services/user.types';

export type UserBody = Req<Pick<Email, 'email'> & Pick<Password, 'password'>>;
