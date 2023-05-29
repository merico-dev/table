import fs from 'fs-extra';
import path from 'path';
import { createHash } from 'crypto';
import { ConfigService } from '../services/config.service';
import { QUERY_CACHE_RETAIN_TIME } from './constants';

const cacheDir = path.resolve(__dirname, '../fs_cache');
fs.ensureDirSync(cacheDir);

const configService = new ConfigService();

export const getFsCacheKey = (key: string): string => {
  return `${createHash('sha256').update(key).digest('hex')}`;
};

export const clearFsCache = async (): Promise<void> => {
  const ttlConfig = await configService.get('query_cache_expire_time');
  const ttl = parseInt(ttlConfig.value! || QUERY_CACHE_RETAIN_TIME);
  const files = await fs.readdir(cacheDir);
  files.forEach(async (file) => {
    const fileInfo = await fs.stat(path.join(cacheDir, file));
    if (fileInfo.birthtimeMs + ttl * 1000 < Date.now()) {
      await fs.remove(path.join(cacheDir, file));
    }
  });
};

export const putFsCache = async (key: string, data: any): Promise<void> => {
  const filename = `${key}.json`;
  await fs.writeJSON(path.join(cacheDir, filename), data);
};

export const getFsCache = async (key: string): Promise<any> => {
  const filename = `${key}.json`;
  try {
    const data = await fs.readJSON(path.join(cacheDir, filename));
    return data;
  } catch (err) {
    return null;
  }
};
