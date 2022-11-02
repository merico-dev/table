import { DataSourceOptions } from 'typeorm';
import { DataSourceConfig } from '../api_models/datasource';

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