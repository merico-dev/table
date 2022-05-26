import { IsOptional, IsString, IsInt } from "class-validator";

export class FilterRequest {
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginationRequest {
  @IsInt()
  page: number;

  @IsInt()
  pagesize: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export interface SortRequest {
  field: string,
  order: string
}

export type PaginationResponse<T> = {
  total: number;
  offset: number;
  data: T[];
}