import { Req } from '../../types';
import { Email, Password } from '../../services/user.types';

export type UserReq = Req<Pick<Email, 'email'> & Pick<Password, 'password'>>;
