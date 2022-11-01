export const SALT_ROUNDS = 12;
export const SECRET_KEY = process.env.SECRET_KEY;
export const TOKEN_VALIDITY = 7 * 24 * 3600;
export const AUTH_ENABLED = parseInt(process.env.ENABLE_AUTH as string ?? 0);