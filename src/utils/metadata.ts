export interface MetaData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const metadata = (...metadata: string[]): MetaData => {
  const [from, to, subject, html] = metadata;
  return {
    from,
    to,
    subject,
    html
  };
};
