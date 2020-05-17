import { Del } from '../types/index';

export const parseDelete = <T>(del: Del<T>): T | null | undefined => del.value;
