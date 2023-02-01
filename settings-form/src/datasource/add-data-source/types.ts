import { DataSourceType, TDataSourceConfig } from '../../api-caller/datasource.typed';

export interface IFormValues {
  type: DataSourceType;
  key: string;
  config: TDataSourceConfig;
}
