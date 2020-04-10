import mailgunInstance from 'mailgun-js';
import { MailMetadata } from 'src/types';

/*== sendMail =====================================================

This function sends email through the server as a proxy, using
mailgun and the mailgun sdk

mailgun: https://www.mailgun.com/
mailgun sdk: https://www.npmjs.com/package/mailgun-js

*/

// create a mailgun instance
const mailgun = mailgunInstance({
  apiKey: String(process.env.MG_KEY),
  domain: String(process.env.MG_DOMAIN),
  testMode: Boolean(process.env.TESTING)
});

// send a piece of mail that contains the passed-in metadata
// metadata must include: sender, recipient, subject, and body html
export const sendMail = async (
  metadata: MailMetadata,
  mg = mailgun
): Promise<void> => {
  await mg.messages().send(metadata);
};
