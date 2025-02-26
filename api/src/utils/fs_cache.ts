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

export const clearFsCacheByContentId = (contentId: string) => {
  fs.emptyDirSync(path.join(cacheDir, contentId));
};

export const putFsCache = async (contentId: string, key: string, data: any): Promise<void> => {
  fs.ensureDirSync(path.join(cacheDir, contentId));
  const filename = `${key}.json`;
  await fs.writeJSON(path.join(cacheDir, contentId, filename), data);
};

export const getFsCache = async (contentId: string, key: string): Promise<any> => {
  fs.ensureDirSync(path.join(cacheDir, contentId));
  const ttl = await getTTL();
  const filename = `${key}.json`;
  try {
    const fileInfo = await fs.stat(path.join(cacheDir, contentId, filename));
    if (fileInfo.mtimeMs + ttl * 1000 < Date.now()) {
      await fs.remove(path.join(cacheDir, contentId, filename));
      return null;
    }
    return fs.readJSON(path.join(cacheDir, contentId, filename));
  } catch (err) {
    return null;
  }
};
