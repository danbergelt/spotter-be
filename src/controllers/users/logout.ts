import { pipe } from 'fp-ts/lib/pipeable';
import { COOKIE_NAME } from '../../utils/constants';
import { OK } from 'http-status-codes';
import { success } from '../../utils/success';
import { Fn } from '../../utils/resolver.types';

// eslint-disable-next-line
export const logout: Fn = (_req, res, _next) => {
  pipe(res.clearCookie(COOKIE_NAME), res => res.status(OK).json(success()));
};
