import path from 'path';
import { DataSource } from "typeorm";

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

export const dashboardDataSource = new DataSource({
    type: 'postgres',
    url: process.env.PG_URL,
    migrationsTableName: 'schema_migrations',
    migrations: ['src/data_sources/migrations/*.ts'],
    entities: ['src/models/app/*.ts'],
});