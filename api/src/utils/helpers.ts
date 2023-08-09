import { DataSourceOptions, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { DataSourceConfig } from '../api_models/datasource';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import { DATABASE_CONNECTION_TIMEOUT_MS, DATABASE_POOL_SIZE } from './constants';
import logger from 'npmlog';
import { omit, PropertyName } from 'lodash';
import { FilterObject } from '../api_models/base';

export function configureDatabaseSource(type: 'mysql' | 'postgresql', config: DataSourceConfig): DataSourceOptions {
  const commonConfig = {
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
  };
  switch (type) {
    case 'mysql':
      return {
        ...commonConfig,
        type: 'mysql',
        connectTimeout: DATABASE_CONNECTION_TIMEOUT_MS,
        poolSize: DATABASE_POOL_SIZE,
      };

    case 'postgresql':
      return {
        ...commonConfig,
        type: 'postgres',
        connectTimeoutMS: DATABASE_CONNECTION_TIMEOUT_MS,
        poolSize: DATABASE_POOL_SIZE,
      };
  }
}

export function escapeLikePattern(input: string): string {
  if (!input) {
    return input;
  }
  return input.replace(/%/g, '\\%').replace(/_/g, '\\_');
}

const marshall = (params: { [propName: string]: any }): string => {
  params = params || {};
  const keys = Object.keys(params).sort();
  const kvs: string[] = [];
  for (const k of keys) {
    if (typeof params[k] !== 'undefined') {
      kvs.push(`${k}=${typeof params[k] === 'object' ? JSON.stringify(params[k]) : params[k]}`);
    }
  }
  return kvs.join('&');
};

export const cryptSign = (params: { [propName: string]: any }, appsecret: string): string => {
  let temp = marshall(params);
  temp += `&key=${appsecret}`;
  const buffer = Buffer.from(temp);
  const crypt = crypto.createHash('MD5');
  crypt.update(buffer);
  return crypt.digest('hex').toUpperCase();
};

export const getDiff = async (oldData: any, newData: any): Promise<string | undefined> => {
  const time = new Date().getTime();
  const dir = path.join(__dirname, `${time}_${oldData.id}`);
  await fs.ensureDir(dir);
  let diff: string | undefined;
  try {
    const options: Partial<SimpleGitOptions> = {
      baseDir: dir,
      binary: 'git',
    };
    const git: SimpleGit = simpleGit(options);
    await git.init();
    await git.addConfig('user.name', 'Devtable');
    await git.addConfig('user.email', 'Devtable@merico.dev');
    const filename = path.join(dir, 'data.json');
    await fs.writeJson(filename, oldData, { spaces: '\t' });
    await git.add(filename);
    await git.commit('First');
    await fs.writeJson(filename, newData, { spaces: '\t' });
    diff = await git.diff();
  } catch (e) {
    logger.warn('get diff failed');
    logger.warn(e);
  }
  await fs.rm(dir, { recursive: true, force: true });
  return diff;
};

export function omitFields<T extends object, K extends PropertyName[]>(
  data: T | null | undefined,
  fields: K,
): Pick<T, Exclude<keyof T, K>> {
  return omit(data, fields) as Pick<T, Exclude<keyof T, K>>;
}

export function applyQueryFilterObjects<A extends ObjectLiteral, B extends object>(
  qb: SelectQueryBuilder<A>,
  filterProperties: { property: string; type: 'FilterObject' | 'FilterObjectNoFuzzy' | 'Primitive' }[],
  tableAlias: string,
  filter?: B,
): void {
  if (filter !== undefined) {
    for (const { property, type } of filterProperties) {
      if (type === 'FilterObject' || type === 'FilterObjectNoFuzzy') {
        const filterField: FilterObject | undefined = filter[property];
        if (filterField === undefined) continue;
        type === 'FilterObject' && filterField.isFuzzy
          ? qb.andWhere(`${tableAlias}.${property} ilike :${property}`, {
              [property]: `%${escapeLikePattern(filterField.value)}%`,
            })
          : qb.andWhere(`${tableAlias}.${property} = :${property}`, { [property]: filterField.value });
      } else if (type === 'Primitive') {
        const filterField = filter[property];
        if (filterField === undefined) continue;
        qb.andWhere(`${tableAlias}.${property} = :${property}`, { [property]: filterField });
      }
    }
  }
}
