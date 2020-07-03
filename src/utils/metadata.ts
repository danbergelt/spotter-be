import { Contact } from '../validators/decoders';
import { EMAILS } from './constants';
import { contactMsg, confirmContactMsg } from './emailTemplates';
import { pipe } from 'fp-ts/lib/pipeable';

const { TEAM, NO_REPLY, CONTACT } = EMAILS;

export interface MetaData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

type MetaDataBuilder = (...args: [string, string, string, string]) => MetaData;
const metadata: MetaDataBuilder = (...args) =>
  pipe(args, ([from, to, subject, html]) => ({ from, to, subject, html }));

type To = (c: Contact) => MetaData;

const toSpotter: To = c =>
  metadata(CONTACT, TEAM, c.subject, contactMsg(c.message, c.name, c.email));

const toUser: To = c =>
  metadata(NO_REPLY, c.email, 'Hello from Spotter', confirmContactMsg);

export { metadata, toSpotter, toUser };
