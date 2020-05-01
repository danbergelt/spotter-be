import { SCHEMAS } from '.';

export type Shape<T> = Record<string, T>;

export type CASE = typeof SCHEMAS[keyof typeof SCHEMAS];
