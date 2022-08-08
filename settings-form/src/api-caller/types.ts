export type PaginationResponse<T> = {
  total: number;
  offset: number;
  data: T[];
};
