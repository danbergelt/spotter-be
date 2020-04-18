import { MongoClient, Collection } from 'mongodb';
import { Agent } from './mongo.types';
import { CONFIG, URI } from './mongo.constants';

const { connect } = MongoClient;

// hook into the db, return an agent to perform operations against

export const useMongo = async (url: string, c = connect): Promise<Agent> => {
  // NOTE --> not catching errors here. if DB connection fails, I want error to bubble up and close the server
  const client = await c(url, CONFIG);

  return (collection): Collection => client.db(URI).collection(collection);
};
