import fs from 'fs-extra';
import path from 'path';
import { createHash } from 'crypto';
import { ConfigService } from '../services/config.service';
import { FS_CACHE_RETAIN_TIME } from './constants';

const cacheDir = path.resolve(__dirname, '../fs_cache');

const configService = new ConfigService();

export const getFsCacheKey = (key: string): string => {
  return `${createHash('sha256').update(key).digest('hex')}`;
};

export const isFsCacheEnabled = async () => {
  const config = await configService.get('query_cache_enabled');
  return config.value === 'true';
};

const getTTL = async (): Promise<number> => {
  const ttlConfig = await configService.get('query_cache_expire_time');
  return parseInt(ttlConfig.value!) || parseInt(FS_CACHE_RETAIN_TIME);
};

export const clearFsCache = () => {
  fs.emptyDirSync(cacheDir);
};

export const putFsCache = async (key: string, data: any): Promise<void> => {
  fs.ensureDirSync(cacheDir);
  const filename = `${key}.json`;
  await fs.writeJSON(path.join(cacheDir, filename), data);
};

export const getFsCache = async (key: string): Promise<any> => {
  fs.ensureDirSync(cacheDir);
  const ttl = await getTTL();
  const filename = `${key}.json`;
  try {
    const fileInfo = await fs.stat(path.join(cacheDir, filename));
    if (fileInfo.mtimeMs + ttl * 1000 < Date.now()) {
      await fs.remove(path.join(cacheDir, filename));
      return null;
    }
    const data = await fs.readJSON(path.join(cacheDir, filename));
    return data;
  } catch (err) {
    return null;
  }
};
