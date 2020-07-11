import { e } from './parsers';
import * as C from 'http-status-codes';

// reusable error responses
export const badGateway = e('Bad gateway', C.BAD_GATEWAY);
export const serverError = e('Server error', C.INTERNAL_SERVER_ERROR);
export const unauthorized = e('Unauthorized', C.UNAUTHORIZED);
export const invalidCredentials = e('Invalid credentials', C.BAD_REQUEST);
export const validationError = e('Validation error', C.BAD_REQUEST);
