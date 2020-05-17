import { Response } from 'express';
import { E } from '../utils/e';
import { failure } from '../utils/httpResponses';

// http error response

export const sendError = ({ status, message }: E, res: Response): Response => {
  return res.status(status).json(failure({ error: message }));
};
