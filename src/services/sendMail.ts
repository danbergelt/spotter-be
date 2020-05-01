import { tryCatch } from 'fp-ts/lib/TaskEither';
import { serverError } from '../utils/errors';
import { HTTPEither } from '../types';
import Mailgun from 'mailgun-js';
import { MetaData } from '../utils/metadata';

const { MG_KEY, MG_DOMAIN, TESTING } = process.env;

// load a new mailgun instance with the below config
const mailgunInstance = new Mailgun({
  apiKey: String(MG_KEY),
  domain: String(MG_DOMAIN),
  testMode: Boolean(TESTING),
  testModeLogger: (): undefined => undefined
});

// send an email with the information from the provided metadata
export const sendMail = (metadata: MetaData, mg = mailgunInstance): HTTPEither<void> => {
  return tryCatch(async () => {
    await mg.messages().send(metadata);
  }, serverError);
};
