export type PaginationResponse<T> = {
  total: number;
  offset: number;
  data: T[];
}

export type DataSourceType = 'postgresql' | 'mysql' | 'http';

export interface IDataSource {
  id: string;
  type: DataSourceType;
  key: string;
}