import { DataSource as Source } from 'typeorm';
import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import { DataSourceConfig } from '../../api_models/datasource';
import { dashboardDataSource } from '../../data_sources/dashboard';
import DataSource from '../../models/datasource';
import { configureDatabaseSource } from '../../utils/helpers';
import { maybeEncryptPassword } from '../../utils/encryption';
import { validateClass } from '../../middleware/validation';

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
    const data: PresetDatasources = validateClass(PresetDatasources, require('../data_sources/config.json'));

    const datasourceRepo = queryRunner.manager.getRepository(DataSource);
    await datasourceRepo.delete({ is_preset: true });

    for (const source of data.postgresql) {
      const { key } = validateClass(DatabaseSource, source);
      const config = validateClass(DatabaseConfig, source.config);
      await testDatabaseConfiguration(key, 'postgresql', config);
      maybeEncryptPassword(config);
      let dataSource: DataSource | null;
      dataSource = await datasourceRepo.findOneBy({ type: 'postgresql', key });
      if (!dataSource) {
        dataSource = new DataSource();
        dataSource.type = 'postgresql';
        dataSource.key = key;
      }
      dataSource.config = config;
      dataSource.is_preset = true;
      await datasourceRepo.save(dataSource);
    }

    for (const source of data.mysql) {
      const { key } = validateClass(DatabaseSource, source);
      const config = validateClass(DatabaseConfig, source.config);
      await testDatabaseConfiguration(key, 'mysql', config);
      maybeEncryptPassword(config);
      let dataSource: DataSource | null;
      dataSource = await datasourceRepo.findOneBy({ type: 'mysql', key });
      if (!dataSource) {
        dataSource = new DataSource();
        dataSource.type = 'mysql';
        dataSource.key = key;
      }
      dataSource.config = config;
      dataSource.is_preset = true;
      await datasourceRepo.save(dataSource);
    }

    for (const source of data.http) {
      const { key } = validateClass(DatabaseSource, source);
      const config = validateClass(BaseConfig, source.config);
      let dataSource: DataSource | null;
      dataSource = await datasourceRepo.findOneBy({ type: 'http', key });
      if (!dataSource) {
        dataSource = new DataSource();
        dataSource.type = 'http';
        dataSource.key = key;
      }
      dataSource.config = config;
      dataSource.is_preset = true;
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

async function testDatabaseConfiguration(
  key: string,
  type: 'mysql' | 'postgresql',
  config: DataSourceConfig,
): Promise<void> {
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
