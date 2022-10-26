import path from 'path';
import { DataSource } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

export const dashboardDataSource = new DataSource({
  type: 'postgres',
  url: process.env.PG_URL,
  migrationsTableName: 'schema_migrations',
  migrations: ['src/data_sources/migrations/*.ts', 'dist/data_sources/migrations/*.js'],
  entities: ['src/models/*.ts', 'dist/models/*.js'],
});