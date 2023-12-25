import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { IsObject, Length, IsString, IsOptional, ValidateNested, IsUUID, IsIn, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { Authentication, FilterObject, PaginationRequest, PaginationResponse, SortRequest } from './base';

@ApiModel({
  description: 'Definition Query object',
  name: 'Query',
})
export class Query {
  @IsString()
  @ApiModelProperty({
    description: 'Query ID',
    required: true,
  })
  id: string;

  @IsIn(['postgresql', 'mysql', 'http', 'transform'])
  @ApiModelProperty({
    description: 'Datasource type',
    required: true,
  })
  type: 'postgresql' | 'mysql' | 'http' | 'transform';

  @IsString()
  @ApiModelProperty({
    description: 'Datasource key',
    required: true,
  })
  key: string;

  @IsString()
  @ApiModelProperty({
    description: 'Query SQL',
    required: true,
  })
  sql: string;

  @IsString()
  @ApiModelProperty({
    description: 'Query pre-processing',
    required: true,
  })
  pre_process: string;
}

@ApiModel({
  description: 'Definition SQL Snippets object',
  name: 'Snippet',
})
export class Snippet {
  @IsString()
  @ApiModelProperty({
    description: 'Snippet ID',
    required: true,
  })
  key: string;

  @IsString()
  @ApiModelProperty({
    description: 'Snippet definition',
    required: true,
  })
  value: string;
}

@ApiModel({
  description: 'Content definition object',
  name: 'ContentDefinition',
})
export class ContentDefinition {
  @IsArray()
  @Type(() => Query)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Content query definitions',
    required: true,
    model: 'Query',
  })
  queries: Query[];

  @IsArray()
  @Type(() => Snippet)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Content sql snippet definitions',
    required: true,
    model: 'Snippet',
  })
  sqlSnippets: Snippet[];
}

@ApiModel({
  description: 'Content object',
  name: 'Content',
})
export class Content {
  @IsObject()
  @Type(() => ContentDefinition)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Content definitions',
    required: true,
    model: 'ContentDefinition',
  })
  definition: ContentDefinition;

  @IsString()
  @ApiModelProperty({
    description: 'Content schema version',
    required: true,
  })
  version: string;
}

@ApiModel({
  description: 'Dashboard content entity',
  name: 'DashboardContent',
})
export class DashboardContent {
  @ApiModelProperty({
    description: 'Dashboard content ID in uuid format',
  })
  id: string;

  @ApiModelProperty({
    description: 'Dashboard ID in uuid format',
  })
  dashboard_id: string;

  @ApiModelProperty({
    description: 'Name of the dashboard content',
  })
  name: string;

  @Type(() => Content)
  @ApiModelProperty({
    description: 'content of the dashboard stored in json object format',
    model: 'Content',
  })
  content: Content;

  @ApiModelProperty({
    description: 'Create time',
  })
  create_time: Date;

  @ApiModelProperty({
    description: 'Time of last update',
  })
  update_time: Date;
}

@ApiModel({
  description: 'Dashboard content filter object',
  name: 'DashboardContentFilterObject',
})
export class DashboardContentFilterObject {
  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on name',
    required: false,
    model: 'FilterObject',
  })
  name?: FilterObject;
}

@ApiModel({
  description: 'Dashboard content sort object',
  name: 'DashboardContentSortObject',
})
export class DashboardContentSortObject implements SortRequest {
  @IsIn(['name', 'create_time', 'update_time'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['name', 'create_time', 'update_time'],
  })
  field: 'name' | 'create_time' | 'update_time';

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
  description: 'Dashboard content list request object',
  name: 'DashboardContentListRequest',
})
export class DashboardContentListRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'Dashboard ID in uuid format',
    required: true,
  })
  dashboard_id: string;

  @IsOptional()
  @Type(() => DashboardContentFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Dashboard content filter object',
    required: false,
    model: 'DashboardContentFilterObject',
  })
  filter?: DashboardContentFilterObject;

  @Type(() => DashboardContentSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Dashboard content sort object',
    required: true,
    model: 'DashboardContentSortObject',
  })
  sort: DashboardContentSortObject[] = [new DashboardContentSortObject({ field: 'create_time', order: 'ASC' })];

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
  description: 'dashboard content pagination response object',
  name: 'DashboardContentPaginationResponse',
})
export class DashboardContentPaginationResponse implements PaginationResponse<DashboardContent> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'Dashboard content list',
    model: 'DashboardContent',
  })
  data: DashboardContent[];
}

@ApiModel({
  description: 'dashboard content create request object',
  name: 'DashboardContentCreateRequest',
})
export class DashboardContentCreateRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'Dashboard ID in uuid format',
    required: true,
  })
  dashboard_id: string;

  @IsString()
  @Length(1, 250)
  @ApiModelProperty({
    description: 'Name of the dashboard content',
    required: true,
  })
  name: string;

  @IsObject()
  @Type(() => Content)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'content stored in json object format',
    required: true,
    model: 'Content',
  })
  content: Content;

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
  description: 'dashboard content update request object',
  name: 'DashboardContentUpdateRequest',
})
export class DashboardContentUpdateRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'Dashboard content ID in uuid format',
    required: true,
  })
  id: string;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @ApiModelProperty({
    description: 'Name of the dashboard content',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsObject()
  @Type(() => Content)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'content of the dashboard stored in json object format',
    required: false,
    model: 'Content',
  })
  content?: Content;

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
  description: 'Dashboard content ID request',
  name: 'DashboardContentIDRequest',
})
export class DashboardContentIDRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'Dashboard content ID in uuid format',
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
