import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Authentication, FilterRequest, PaginationRequest, PaginationResponse, SortRequest } from './base';
import { ROLE_TYPES } from './role';

@ApiModel({
  description: 'ApiKey entity',
  name: 'ApiKey',
})
export class ApiKey {
  @ApiModelProperty({
    description: 'ApiKey ID in uuid format',
    required: false,
  })
  id: string;

  @ApiModelProperty({
    description: 'Name of the ApiKey',
    required: true,
  })
  name: string;

  @ApiModelProperty({
    description: 'ApiKey role ID',
    required: true,
  })
  role_id: number;

  @ApiModelProperty({
    description: 'AppId of the ApiKey',
    required: true,
  })
  app_id: string;

  @ApiModelProperty({
    description: 'AppSecret of the ApiKey',
    required: true,
  })
  app_secret: string;

  @ApiModelProperty({
    description : 'whether the ApiKey is preset or not' ,
    required : false,
  })
  is_preset: boolean;
}

@ApiModel({
  description: 'ApiKey filter object',
  name: 'ApiKeyFilterObject',
})
export class ApiKeyFilterObject implements FilterRequest {
  @IsOptional()
  @ApiModelProperty({
    description: 'search term. Uses fuzzy search for name',
    required: false,
  })
  search?: string;
}

@ApiModel({
  description: 'ApiKey sort object',
  name: 'ApiKeySortObject'
})
export class ApiKeySortObject implements SortRequest {
  @IsIn(['name', 'create_time', 'is_preset'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['name', 'create_time', 'is_preset'],
  })
  field: 'name' | 'create_time' | 'is_preset';

  @IsIn(['ASC', 'DESC'])
  @ApiModelProperty({
    description: 'Sort order',
    required: true,
    enum: ['ASC', 'DESC'],
  })
  order: 'ASC' | 'DESC';

  constructor(data: any) {
    Object.assign(this, data);
  }
}

@ApiModel({
  description: 'ApiKey list request object',
  name: 'ApiKeyListRequest',
})
export class ApiKeyListRequest {
  @IsOptional()
  @Type(() => ApiKeyFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'ApiKey filter object',
    required: false,
    model: 'ApiKeyFilterObject',
  })
  filter?: ApiKeyFilterObject;

  @Type(() => ApiKeySortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'ApiKey sort object',
    required: true,
    model: 'ApiKeySortObject',
  })
  sort: ApiKeySortObject = new ApiKeySortObject({ field: 'create_time', order: 'ASC' });

  @Type(() => PaginationRequest)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Pagination object',
    required: true,
    model: 'PaginationRequest',
  })
  pagination: PaginationRequest = new PaginationRequest({ page: 1, pagesize: 20 });

  @IsOptional()
  @Type(() => Authentication)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'authentication object for use with app_id / app_secret',
    required: false,
    model: 'Authentication',
  })
  authentication?: Authentication;
}

@ApiModel({
  description: 'ApiKey pagination response object',
  name: 'ApiKeyPaginationResponse',
})
export class ApiKeyPaginationResponse implements PaginationResponse<ApiKey> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'ApiKeys',
    model: 'ApiKey',
  })
  data: ApiKey[];
}

@ApiModel({
  description: 'ApiKey create request object',
  name: 'ApiKeyCreateRequest',
})
export class ApiKeyCreateRequest {
  @IsString()
  @Length(1, 100)
  @ApiModelProperty({
    description: 'ApiKey name',
    required: true,
  })
  name: string;

  @IsInt()
  @IsIn([ROLE_TYPES.INACTIVE, ROLE_TYPES.READER, ROLE_TYPES.AUTHOR, ROLE_TYPES.ADMIN])
  @ApiModelProperty({
    description: 'ApiKey role ID',
    required: true,
    enum: [ROLE_TYPES.INACTIVE.toString(), ROLE_TYPES.READER.toString(), ROLE_TYPES.AUTHOR.toString(), ROLE_TYPES.ADMIN.toString()],
  })
  role_id: ROLE_TYPES.INACTIVE | ROLE_TYPES.READER | ROLE_TYPES.AUTHOR | ROLE_TYPES.ADMIN;

  @IsOptional()
  @Type(() => Authentication)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'authentication object for use with app_id / app_secret',
    required: false,
    model: 'Authentication',
  })
  authentication?: Authentication;
}

@ApiModel({
  description: 'ApiKey ID request',
  name: 'ApiKeyIDRequest',
})
export class ApiKeyIDRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'ApiKey uuid',
    required: true,
  })
  id: string;

  @IsOptional()
  @Type(() => Authentication)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'authentication object for use with app_id / app_secret',
    required: false,
    model: 'Authentication',
  })
  authentication?: Authentication;
}