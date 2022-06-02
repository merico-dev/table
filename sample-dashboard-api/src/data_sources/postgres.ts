import path from 'path';
import { DataSource } from 'typeorm';
import logger from 'npmlog';

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const keys: string[] = process.env.PG_DATA_SOURCE_KEY ? process.env.PG_DATA_SOURCE_KEY.split(';') : [];
const hosts: string[] = process.env.PG_DATA_SOURCE_HOST ? process.env.PG_DATA_SOURCE_HOST.split(';') : [];
const ports: number[] = process.env.PG_DATA_SOURCE_PORT ? process.env.PG_DATA_SOURCE_PORT.split(';').map(p => parseInt(p)) : [];
const usernames: string[] = process.env.PG_DATA_SOURCE_USERNAME ? process.env.PG_DATA_SOURCE_USERNAME.split(';') : [];
const passwords: string[] = process.env.PG_DATA_SOURCE_PASSWORD ? process.env.PG_DATA_SOURCE_PASSWORD.split(';') : [];
const databases: string[] = process.env.PG_DATA_SOURCE_DATABASE ? process.env.PG_DATA_SOURCE_DATABASE.split(';') : [];

const datasources = {};
for (let i = 0; i < keys.length; i++) {
  const key = keys[i];
  const host = hosts[i];
  const port = ports[i];
  const username = usernames[i];
  const password = passwords[i];
  const database = databases[i];

  if (datasources[key]) {
    logger.warn(`duplicate postgres datasource key ${key}. Please check .env config`);
  }
  datasources[key] = new DataSource({
    type: 'postgres',
    host,
    port: port,
    username,
    password,
    database
  })
}

export default datasources;