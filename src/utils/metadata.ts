import { Contact } from '../validators/decoders';
import { EMAILS } from './constants';
import { contactMsg, confirmContactMsg } from './emailTemplates';

interface MetaData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

type To = (c: Contact) => MetaData;

const { TEAM, NO_REPLY, CONTACT } = EMAILS;

const toSpotter: To = c => ({
  from: CONTACT,
  to: TEAM,
  subject: c.subject,
  html: contactMsg(c.message, c.name, c.email)
});

const toUser: To = c => ({
  from: NO_REPLY,
  to: c.email,
  subject: 'Hello from Spotter',
  html: confirmContactMsg
});

export { toSpotter, toUser, MetaData };
