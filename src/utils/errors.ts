import { e } from './parsers';
import * as E from 'http-status-codes';

// reusable error responses
export const invalidCredentials = e('Invalid credentials', E.BAD_REQUEST);
export const badGateway = e('Bad gateway', E.BAD_GATEWAY);
export const _ = e('_', E.BAD_REQUEST);
export const serverError = e('Server error', E.INTERNAL_SERVER_ERROR);
export const unauthorized = e('Unauthorized', E.UNAUTHORIZED);
