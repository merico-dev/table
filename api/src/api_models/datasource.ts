import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Length, IsString, IsOptional, ValidateNested, IsUUID, IsIn, IsInt, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { Authentication, FilterObject, PaginationRequest, PaginationResponse, SortRequest } from './base';

@ApiModel({
  description: 'Processing config of DataSource',
  name: 'DataSourceProcessingConfig',
})
export class DataSourceProcessingConfig {
  @IsString()
  @ApiModelProperty({
    description: 'pre',
    required: true,
  })
  pre: string;

  @IsString()
  @ApiModelProperty({
    description: 'post',
    required: true,
  })
  post: string;
}

@ApiModel({
  description: 'Datasource config',
  name: 'DataSourceConfig',
})
export class DataSourceConfig {
  @IsString()
  @ApiModelProperty({
    description: 'host',
    required: true,
  })
  host: string;

  @IsOptional()
  @IsObject()
  @Type(() => DataSourceProcessingConfig)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Processings for each HTTP request',
    required: false,
    model: 'DataSourceProcessingConfig',
  })
  processing?: DataSourceProcessingConfig;

  @IsOptional()
  @IsInt()
  @ApiModelProperty({
    description: 'port',
    required: false,
  })
  port?: number;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'username. Required for mysql | postgresql data sources',
    required: false,
  })
  username?: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'password. Required for mysql | postgresql data sources',
    required: false,
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'database name. Required for mysql | postgresql data sources',
    required: false,
  })
  database?: string;
}

@ApiModel({
  description: 'Datasource entity',
  name: 'DataSource',
})
export class DataSource {
  @ApiModelProperty({
    description: 'datasource ID in uuid format',
    required: false,
  })
  id: string;

  @ApiModelProperty({
    description: 'type of the datasource',
    required: true,
    enum: ['postgresql', 'mysql', 'http'],
  })
  type: string;

  @ApiModelProperty({
    description: 'key of the datasource',
    required: true,
  })
  key: string;

  @ApiModelProperty({
    description: 'whether the datasource is preset or not',
    required: false,
  })
  is_preset: boolean;
}

@ApiModel({
  description: 'DataSource filter object',
  name: 'DataSourceFilterObject',
})
export class DataSourceFilterObject {
  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on type',
    required: false,
    model: 'FilterObject',
  })
  type?: FilterObject;

  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on key',
    required: false,
    model: 'FilterObject',
  })
  key?: FilterObject;
}

@ApiModel({
  description: 'DataSource sort object',
  name: 'DataSourceSortObject',
})
export class DataSourceSortObject implements SortRequest {
  @IsIn(['type', 'key', 'create_time', 'is_preset'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['type', 'key', 'create_time', 'is_preset'],
  })
  field: 'type' | 'key' | 'create_time' | 'is_preset';

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
  description: 'DataSource list request object',
  name: 'DataSourceListRequest',
})
export class DataSourceListRequest {
  @IsOptional()
  @Type(() => DataSourceFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'DataSource filter object',
    required: false,
    model: 'DataSourceFilterObject',
  })
  filter?: DataSourceFilterObject;

  @Type(() => DataSourceSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'DataSource sort object',
    required: true,
    model: 'DataSourceSortObject',
  })
  sort: DataSourceSortObject[] = [new DataSourceSortObject({ field: 'create_time', order: 'ASC' })];

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
  description: 'DataSource pagination response object',
  name: 'DataSourcePaginationResponse',
})
export class DataSourcePaginationResponse implements PaginationResponse<DataSource> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'DataSources',
    model: 'DataSource',
  })
  data: DataSource[];
}

@ApiModel({
  description: 'DataSource create request object',
  name: 'DataSourceCreateRequest',
})
export class DataSourceCreateRequest {
  @IsString()
  @IsIn(['postgresql', 'mysql', 'http'])
  @ApiModelProperty({
    description: 'type of the datasource',
    required: true,
    enum: ['postgresql', 'mysql', 'http'],
  })
  type: 'postgresql' | 'mysql' | 'http';

  @IsString()
  @Length(1, 250)
  @ApiModelProperty({
    description: 'key of the datasource',
    required: true,
  })
  key: string;

  @IsObject()
  @Type(() => DataSourceConfig)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'config of the datasource stored in json object format',
    required: true,
    model: 'DataSourceConfig',
  })
  config: DataSourceConfig;

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
  description: 'DataSource ID request',
  name: 'DataSourceIDRequest',
})
export class DataSourceIDRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'DataSource uuid',
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

@ApiModel({
  description: 'DataSource Rename request',
  name: 'DataSourceRenameRequest',
})
export class DataSourceRenameRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'DataSource uuid',
    required: true,
  })
  id: string;

  @IsString()
  @Length(1, 250)
  @ApiModelProperty({
    description: 'DataSource key',
    required: true,
  })
  key: string;
}
