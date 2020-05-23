export const forgotPw = (url: string): string =>
  `
  <html>
  <div>Someone requested a password reset for your account. If this was not you, please disregard this email. If you'd like to continue click the link below.</div>
  <br />
  <div>This link will expire in 10 minutes.</div>
  <br />
  <a href="${url}">${url}</a>
  </html>`;

export const contactMsg = (message: string, name: string, email: string): string =>
  `
  <html>
  <div>Name: ${name}</div>
  <br />
  <div>Email: ${email}</div>
  <br />
  <div>Message: ${message}</div>
  </html>`;

export const confirmContactMsg = (): string =>
  `<html>
  <div>Hi there! This is a confirmation that we've received your inquiry. We'll get back to you as soon as possible.</div>
  <br />
  <div>Thanks for your patience!</div>
  <br />
  <div>- Team Spotter</div>
  </html>`;
