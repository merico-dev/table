import { IsInt, ValidationError } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

export interface FilterRequest {
  search?: string;
  selection?: string;
}

export interface SortRequest {
  field: string;
  order: 'ASC' | 'DESC';
}

@ApiModel({
  description: 'Pagination object',
  name: 'PaginationRequest'
})
export class PaginationRequest {
  @IsInt()
  @ApiModelProperty({
    description: 'Current page',
    required: true,
  })
  page: number;

  @IsInt()
  @ApiModelProperty({
    description: 'Size of page',
    required: true,
  })
  pagesize: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export interface PaginationResponse<T> {
  total: number;
  offset: number;
  data: T[];
}

@ApiModel({
  description: 'Api Error Details',
  name: 'ApiErrorDetail'
})
class ApiErrorDetail {
  @ApiModelProperty({
    description: 'error message',
    required: true,
  })
  message: string;

  @ApiModelProperty({
    description: 'Error details',
    required: false,
  })
  errors?: ValidationError[];
}

@ApiModel({
  description: 'APIError',
  name: 'ApiError',
})
export class ApiError {
  @ApiModelProperty({
    description: 'Error code',
    required: true,
  })
  code: string;

  @ApiModelProperty({
    description: 'Error details',
    required: false,
    model: 'ApiErrorDetail',
  })
  detail: ApiErrorDetail;
}