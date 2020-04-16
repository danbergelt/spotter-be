import { MongoClient, Db, Collection } from 'mongodb';
import { Accessor } from './mongo.types';
import { config } from './mongo.constants';
import { Error as E } from '../utils/e.types';

const { connect } = MongoClient;

const connectToMongo = async (url: string): Promise<Db> => {
  const client = await connect(url, config);
  const db = client.db();
  return db;
};

export const useMongo = async (url: string): Promise<Accessor | E> => {
  const db = await connectToMongo(url);
  return (collection): Collection => {
    return db.collection(collection);
  };
};
