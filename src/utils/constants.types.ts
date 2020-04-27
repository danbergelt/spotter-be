import { COLLECTIONS } from './constants';

export type COLLECTION = typeof COLLECTIONS[keyof typeof COLLECTIONS];
