import { e, E } from './e';
import { BAD_REQUEST, BAD_GATEWAY, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';

// reusable error responses

export const invalidCredentials = (): E => e('Invalid credentials', BAD_REQUEST);
export const badGateway = (): E => e('Bad gateway', BAD_GATEWAY);
export const _ = (): E => e('_', BAD_REQUEST);
export const validationErr = (message: string): E => e(message, BAD_REQUEST);
export const serverError = (): E => e('Server error', INTERNAL_SERVER_ERROR);
export const unauthorized = (): E => e('Unauthorized', UNAUTHORIZED);
