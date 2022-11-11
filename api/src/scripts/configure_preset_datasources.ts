import { DataSource as Source } from 'typeorm';
import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import path from 'path';
import { Like } from 'typeorm';
import { DataSourceConfig } from '../api_models/datasource';
import { dashboardDataSource } from '../data_sources/dashboard';
import DataSource from '../models/datasource';
import { PRESET_PREFIX } from '../utils/constants';
import { configureDatabaseSource } from '../utils/helpers';
import { maybeEncryptPassword } from '../utils/encryption';
import { validate } from '../middleware/validation';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class DatabaseSource {
  @IsString()
  key: string;

  @Type(() => DataSourceConfig)
  config: DataSourceConfig;
}

class BaseConfig {
  @IsString()
  host: string;
}

class DatabaseConfig extends BaseConfig {
  @IsInt()
  port: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  database: string;
}

class PresetDatasources {
  @ValidateNested({ each: true })
  @Type(() => DatabaseSource)
  postgresql: DatabaseSource[];

  @ValidateNested({ each: true })
  @Type(() => DatabaseSource)
  mysql: DatabaseSource[];

  @ValidateNested({ each: true })
  @Type(() => DatabaseSource)
  http: DatabaseSource[];
}

async function upsert() {
  console.log('Starting upsert of preset datasources');
  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }
  const queryRunner = dashboardDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data: PresetDatasources = validate(PresetDatasources, require('../data_sources/preset.json'));
    
    const datasourceRepo = queryRunner.manager.getRepository(DataSource);
    await datasourceRepo.delete({ key: Like(`${PRESET_PREFIX}%`) });

    for (const source of data.postgresql) {
      const { key } = validate(DatabaseSource, source);
      const config = validate(DatabaseConfig, source.config);
      await testDatabaseConfiguration(key, 'postgresql', config);
      maybeEncryptPassword(config);
      const dataSource = new DataSource();
      dataSource.type = 'postgresql';
      dataSource.key = `${PRESET_PREFIX}${key}`;
      dataSource.config = config;
      await datasourceRepo.save(dataSource);
    }

    for (const source of data.mysql) {
      const { key } = validate(DatabaseSource, source);
      const config = validate(DatabaseConfig, source.config);
      await testDatabaseConfiguration(key, 'mysql', config);
      maybeEncryptPassword(config);
      const dataSource = new DataSource();
      dataSource.type = 'mysql';
      dataSource.key = `${PRESET_PREFIX}${key}`;
      dataSource.config = config;
      await datasourceRepo.save(dataSource);
    }

    for (const source of data.http) {
      const { key } = validate(DatabaseSource, source);
      const config = validate(BaseConfig, source.config);
      const dataSource = new DataSource();
      dataSource.type = 'http';
      dataSource.key = `${PRESET_PREFIX}${key}`;
      dataSource.config = config;
      await datasourceRepo.save(dataSource);
    }
    await queryRunner.commitTransaction();
    console.info('Finished upsert of preset datasources');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error upserting preset datasources:', error);
  } finally {
    await queryRunner.release();
    await dashboardDataSource.destroy();
  }
}

async function testDatabaseConfiguration(key: string, type: 'mysql' | 'postgresql', config: DataSourceConfig): Promise<void> {
  const configuration = configureDatabaseSource(type, config);
  const source = new Source(configuration);
  try {
    await source.initialize();
  } catch (error) {
    throw new Error(`${key} has incorrect configuration: ${error.message}`);      
  }
  await source.destroy();
}

upsert();