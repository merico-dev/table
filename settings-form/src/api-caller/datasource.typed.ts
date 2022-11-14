export type DataSourceType = 'postgresql' | 'mysql' | 'http';

export interface IDataSource {
  id: string;
  type: DataSourceType;
  key: string;
  is_preset?: boolean;
}

export interface IDataSourceConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
