import { IRouter as RT, IRoute as RE } from 'express';
import { Fn } from './wrap.types';
import { M } from './endpoints.types';

export const ep = (r: RT) => (p: string) => (m: M) => (...cb: Fn[]): RE => r.route(p)[m](...cb);
