import { DataSourceOptions } from 'typeorm';
import { DataSourceConfig } from '../api_models/datasource';
import crypto from 'crypto';

const DATABASE_CONNECTION_TIMEOUT_MS = 5000;

export function configureDatabaseSource(type: 'mysql' | 'postgresql', config: DataSourceConfig): DataSourceOptions {
  const commonConfig = {
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database
  }
  switch(type) {
    case 'mysql':
      return {
        ...commonConfig,
        type: 'mysql',
        connectTimeout: DATABASE_CONNECTION_TIMEOUT_MS,
      };

    case 'postgresql':
      return {
        ...commonConfig,
        type: 'postgres',
        connectTimeoutMS: DATABASE_CONNECTION_TIMEOUT_MS,
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
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (typeof params[k] !== 'undefined') {
      kvs.push(`${keys[i]}=${typeof params[k] === 'object' ? JSON.stringify(params[k]) : params[k]}`);
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