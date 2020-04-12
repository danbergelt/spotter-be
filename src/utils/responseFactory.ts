import { Response } from 'express';

/*== responseFactory =====================================================

Returns a JSON response to the client with a standardized format. Accepts
the response object, a status, the success boolean, and an optional param
of additional data to include in the response

*/

export const responseFactory = (
  res: Response,
  status: number,
  success: boolean,
  data?: Record<string, unknown>
): Response => {
  return res.status(status).json({ success, ...data });
};
