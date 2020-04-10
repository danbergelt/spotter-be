import mailgun from 'mailgun-js';

// new mailgun instance
const mg = mailgun({
  apiKey: String(process.env.MG_KEY),
  domain: String(process.env.MG_DOMAIN),
  testMode: Boolean(process.env.TESTING)
});

// send mail async function - sends an automated email when called
export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  await mg.messages().send({ from, to, subject, html });
};
