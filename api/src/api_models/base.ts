import { IsBoolean, IsInt, IsString, ValidationError } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Filter object',
  name: 'FilterObject',
})
export class FilterObject {
  @IsString()
  @ApiModelProperty({
    description: 'Value to be used in the filter',
    required: true,
  })
  value: string;

  @IsBoolean()
  @ApiModelProperty({
    description: 'Wether the filter should use fuzzy matching or exact matching',
    required: true,
  })
  isFuzzy: boolean;
}

export interface SortRequest {
  field: string;
  order: 'ASC' | 'DESC';
}

@ApiModel({
  description: 'Pagination object',
  name: 'PaginationRequest',
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
  name: 'ApiErrorDetail',
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

@ApiModel({
  description: 'Authentication object for using app_id and app_secret',
  name: 'Authentication',
})
export class Authentication {
  @IsString()
  @ApiModelProperty({
    description: 'app_id',
    required: true,
  })
  app_id: string;

  @IsString()
  @ApiModelProperty({
    description: 'nonce_str',
    required: true,
  })
  nonce_str: string;

  @IsString()
  @ApiModelProperty({
    description: 'sign',
    required: true,
  })
  sign: string;
}
