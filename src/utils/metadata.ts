export interface MetaData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// build a metadata object to be used when sending emails with mailgun

export const metadata = (...metadata: [string, string, string, string]): MetaData => {
  const [from, to, subject, html] = metadata;
  return {
    from,
    to,
    subject,
    html
  };
};
