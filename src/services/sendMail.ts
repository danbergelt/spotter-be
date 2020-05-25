import { tryCatch } from 'fp-ts/lib/TaskEither';
import { serverError } from '../utils/errors';
import { Async } from '../types';
import Mailgun from 'mailgun-js';
import { MetaData } from '../utils/parsers';

const { MG_KEY, MG_DOMAIN, TESTING } = process.env;

const mailgunInstance = new Mailgun({
  apiKey: String(MG_KEY),
  domain: String(MG_DOMAIN),
  testMode: Boolean(TESTING),
  testModeLogger: (): null => null
});

// send an email with the information from the provided metadata
type SR = Mailgun.messages.SendResponse;
export const sendMail = (metadata: MetaData, mg = mailgunInstance): Async<SR> =>
  tryCatch(async () => await mg.messages().send(metadata), serverError);
