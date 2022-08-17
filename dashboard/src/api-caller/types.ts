import { DataSourceType } from '../model/queries/types';

export type PaginationResponse<T> = {
  total: number;
  offset: number;
  data: T[];
};

export interface IDataSource {
  id: string;
  type: DataSourceType;
  key: string;
}
