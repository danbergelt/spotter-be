import { Fn } from './wrap.types';

// HOF that wraps an express middleware to automatically catch errors in the express error middleware

export function wrap(fn: Fn): Fn {
  return function(req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next); // eslint-disable-line
  } as Fn;
}
