import { createHash } from 'crypto';
import Redis from 'ioredis';
import { ConfigService } from '../services/config.service';
import { CACHE_RETAIN_TIME } from './constants';

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
const cachePrefix = 'devtable';
const configService = new ConfigService();

export const getCacheKey = (key: string): string => {
  return `${createHash('sha256').update(key).digest('hex')}`;
};

export const isCacheEnabled = async () => {
  const config = await configService.get('query_cache_enabled');
  return config.value === 'true';
};

const getTTL = async (): Promise<number> => {
  const ttlConfig = await configService.get('query_cache_expire_time');
  return parseInt(ttlConfig.value!) || parseInt(CACHE_RETAIN_TIME);
};

export const clearCache = async () => {
  await redis.flushdb();
};

export const clearCacheByContentId = async (contentId: string) => {
  const keys = await redis.keys(`${cachePrefix}:${contentId}:*`);
  const pipeline = redis.pipeline();
  keys.forEach((key) => {
    pipeline.del(key);
  });
  await pipeline.exec();
};

export const putCache = async (contentId: string, key: string, data: any): Promise<void> => {
  const ttl = await getTTL();
  await redis.set(`${cachePrefix}:${contentId}:${key}`, JSON.stringify(data), 'EX', ttl);
};

export const getCache = async (contentId: string, key: string): Promise<any> => {
  try {
    const data = await redis.get(`${cachePrefix}:${contentId}:${key}`);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (err) {
    return null;
  }
};
