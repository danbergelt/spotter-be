export const AUTH_SECRET = process.env.JWT_SECRET || 'unauthorized';
export const AUTH_EXPIRY = process.env.JWT_EXPIRE || '0d';
export const REFRESH_SECRET = process.env.REF_SECRET || 'unauthorized';
export const REFRESH_EXPIRY = process.env.REF_EXPIRE || '0d';
