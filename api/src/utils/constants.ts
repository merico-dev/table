export const SALT_ROUNDS = 12;
export const SECRET_KEY = process.env.SECRET_KEY;
export const TOKEN_VALIDITY = 7 * 24 * 3600;
export const AUTH_ENABLED = process.env.ENABLE_AUTH !== '0';
export const DATABASE_CONNECTION_TIMEOUT_MS = parseInt(process.env.DATABASE_CONNECTION_TIMEOUT_MS ?? '30000');