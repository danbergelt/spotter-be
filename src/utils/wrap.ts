import { Fn } from './wrap.types';

export function wrap(fn: Fn): Fn {
  return function(req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next); // eslint-disable-line
  } as Fn;
}
