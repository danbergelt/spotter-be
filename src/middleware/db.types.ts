import { COLLECTIONS } from '../utils/constants';
import { Collection } from 'mongodb';

export type COLLECTION = typeof COLLECTIONS[keyof typeof COLLECTIONS];

export type Agent = (collection: COLLECTION) => Collection;
