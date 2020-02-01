import mailgun from 'mailgun-js';
const DOMAIN: string | undefined = process.env.MG_DOMAIN;
const TESTING: string | undefined = process.env.TESTING;
// new mailgun instance
const mg: mailgun.Mailgun = mailgun({
  apiKey: process.env.MG_KEY || 'unauthorized',
  // need to change domain once production domain is purchased and verified in mailgun
  domain: DOMAIN || 'unauthorized',
  testMode: Boolean(TESTING)
});

// data object that specifies a sender, recipient, email subject, and html template for email
interface MGData {
  from: string;
  to: string;
  subject: string;
  html: string;
}
const data = (
  from: string,
  to: string,
  subject: string,
  html: string
): MGData => {
  return {
    // need to change from email once domain is purchased and verified in mailgun
    from,
    to,
    subject,
    html
  };
};

// send mail async function - sends an automated email when called
type TSendMail = (
  from: string,
  to: string,
  subject: string,
  html: string
) => Promise<void>;
export const sendMail: TSendMail = async (from, to, subject, html) => {
  await mg.messages().send(data(from, to, subject, html));
};

// email template for forgot password
export const forgotPasswordTemplate = (url: string): string => {
  return `
  <html>
  <div>Someone requested a password reset for your account. If this was not you, please disregard this email. If you'd like to continue click the link below.</div>
  <br />
  <div>This link will expire in 10 minutes.</div>
  <br />
  <a href="${url}">${url}</a>
  </html>`;
};

// email template for contact message
export const contactMessageTemplate = (
  message: string,
  name: string,
  email: string
): string => {
  return `
  <html>
  <div>Name: ${name}</div>
  <br />
  <div>Email: ${email}</div>
  <br />
  <div>Message: ${message}</div>
  </html>`;
};

export const contactConfirmTemplate = (): string => {
  return `<html>
  <div>Hi there! This is a confirmation that we've received your inquiry. We'll get back to you as soon as possible.</div>
  <br />
  <div>Thanks for your patience!</div>
  <br />
  <div>- Team Spotter</div>
  </html>`;
};
