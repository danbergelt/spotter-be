import { ExpressFn } from '../types';

/*== async handler =====================================================

this higher order function wraps controllers and allows us to optionally include
try/catch blocks for async behavior.

since try/catch blocks are a) not DRY and b) tedious, inelegant, and annoying, 
we can abstract repetitive errs (such as DB validation errors) to the 
error handling middleware automatically. this allows us to focus on novel, 
one-off errors that require special care, and greatly cleans up our code

*/

function asyncHandler(fn: ExpressFn): ExpressFn {
  const wrapped: ExpressFn = function(req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next); // eslint-disable-line
  };
  return wrapped;
}

export default asyncHandler;
