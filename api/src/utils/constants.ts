export const SALT_ROUNDS = 12;
export const SECRET_KEY = process.env.SECRET_KEY;
export const TOKEN_VALIDITY = 7 * 24 * 3600;
export const AUTH_ENABLED = process.env.ENABLE_AUTH !== '0';
export const DATABASE_CONNECTION_TIMEOUT_MS = parseInt(process.env.DATABASE_CONNECTION_TIMEOUT_MS ?? '30000');
export const DATABASE_POOL_SIZE = parseInt(process.env.DATABASE_POOL_SIZE ?? '10');
export const DEFAULT_LANGUAGE = 'en';
export const CACHE_RETAIN_TIME = '86400';
export const QUERY_PARSING_ENABLED = process.env.ENABLE_QUERY_PARSER === '1';
