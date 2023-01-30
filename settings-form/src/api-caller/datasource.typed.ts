export type DataSourceType = 'postgresql' | 'mysql' | 'http';

export interface IDataSource {
  id: string;
  type: DataSourceType;
  key: string;
  is_preset?: boolean;
}

export type TDataSourceConfig_DB = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type TDataSourceConfig = TDataSourceConfig_DB;
