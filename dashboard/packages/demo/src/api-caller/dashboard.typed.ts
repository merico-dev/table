export type PaginationResponse<T> = {
  total: number;
  offset: number;
  data: T[];
}

export interface IDBDashboard {
  id: string;
  name: string;
  content: Record<string, any>;
  create_time: string;
  update_time: string;
  is_removed: boolean;
}