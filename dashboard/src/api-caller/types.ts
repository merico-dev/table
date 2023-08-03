import { DataSourceType } from '~/model';

export type PaginationResponse<T> = {
  total: number;
  offset: number;
  data: T[];
};

export type TDataSourceConfig_DB = Record<string, never>;

export type TDataSourceConfig_HTTP = {
  host: string;
  processing: {
    pre: TFunctionString;
    post: TFunctionString;
  };
};

export type TDataSourceConfig = TDataSourceConfig_DB | TDataSourceConfig_HTTP;

export interface IDataSource {
  id: string;
  type: DataSourceType;
  key: string;
  config: TDataSourceConfig;
}
