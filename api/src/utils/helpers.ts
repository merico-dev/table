import { DataSourceOptions } from 'typeorm';
import { DataSourceConfig } from '../api_models/datasource';
import { AUTH_ENABLED } from './constants';
import { ApiError, AUTH_NOT_ENABLED } from './errors';

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

export function checkControllerActive() {
  if (!AUTH_ENABLED) {
    throw new ApiError(AUTH_NOT_ENABLED, { message: 'Authentication system is not enabled' });
  }
}