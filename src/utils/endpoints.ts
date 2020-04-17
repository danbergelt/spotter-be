import { IRouter as RT, IRoute as RE } from 'express';
import { Fn } from './wrap.types';
import { M } from './endpoints.types';

// dynamically builds an express route. accepts a router, a path, a method, and functions to inject into the route

export const ep = (r: RT) => (p: string) => (m: M) => (...cb: Fn[]): RE => r.route(p)[m](...cb);
