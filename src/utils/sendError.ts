import { Response } from 'express';
import { sanitizeError } from '../utils/sanitization';
import { E } from '../utils/e';
import { failure } from '../utils/httpResponses';

// http error response

export const sendError = ({ status, message }: E, res: Response): Response => {
  return res.status(status).json(failure({ error: sanitizeError(message) }));
};
