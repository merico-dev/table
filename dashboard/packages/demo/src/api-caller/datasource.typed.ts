export interface IDataSource {
  id: string;
  type: 'postgresql' | 'mysql' | 'http';
  key: string;
}
