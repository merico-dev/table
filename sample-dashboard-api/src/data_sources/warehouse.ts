import path from 'path';
import { DataSource } from "typeorm";

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

export const warehouseDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATA_SOURCE_PG_URL,
});