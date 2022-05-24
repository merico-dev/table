export type PaginationResponse<T> = {
  total: number;
  offset: number;
  data: T[];
};

export type SortOrder = 'ASC' | 'DESC';

export type FilterRequest = {
  search?: string;
}

export type PaginationRequest = {
  page: number;
  pagesize: number;
};

export type SortRequest = {
  field?: string;
  order?: SortOrder;
};

export function checkSort(sort: SortRequest, validFields: string[]): boolean {
  if (!sort.field || !sort.order) {
    return false;
  }
  return validFields.includes(sort.field) && ['ASC', 'DESC'].includes(sort.order.toUpperCase());
}
