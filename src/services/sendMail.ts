import { constNull } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { serverError } from '../utils/errors';
import { Async } from '../types';
import Mailgun from 'mailgun-js';
import { MetaData } from '../utils/metadata';

type MG = Mailgun.Mailgun;
type MGResponse = Mailgun.messages.SendResponse;

const mailgunInstance = new Mailgun({
  apiKey: String(process.env.MG_KEY),
  domain: String(process.env.MG_DOMAIN),
  testMode: Boolean(process.env.TESTING),
  testModeLogger: constNull
});

// send an email with the information from the provided metadata
type SendMail = (md: MetaData, mg?: MG) => Async<MGResponse>;
const sendMail: SendMail = (md, mg = mailgunInstance) =>
  TE.tryCatch(
    async () => await mg.messages().send(md),
    () => serverError
  );

export { sendMail, MGResponse };
