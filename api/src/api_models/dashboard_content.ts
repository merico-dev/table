import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { IsObject, Length, IsString, IsOptional, ValidateNested, IsUUID, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { Authentication, FilterObject, PaginationRequest, PaginationResponse, SortRequest } from './base';

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

  @ApiModelProperty({
    description: 'content of the dashboard stored in json object format',
    type: SwaggerDefinitionConstant.JSON,
  })
  content: object | null;

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
  @ApiModelProperty({
    description: 'content stored in json object format',
    required: true,
    type: SwaggerDefinitionConstant.JSON,
  })
  content: Record<string, any>;

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
  @ApiModelProperty({
    description: 'content of the dashboard stored in json object format',
    required: false,
    type: SwaggerDefinitionConstant.JSON,
  })
  content?: Record<string, any>;

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
