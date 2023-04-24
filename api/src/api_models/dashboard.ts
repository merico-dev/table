import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { IsObject, Length, IsString, IsOptional, ValidateNested, IsUUID, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { Authentication, FilterObject, PaginationRequest, PaginationResponse, SortRequest } from './base';
import { PermissionResource } from './dashboard_permission';

@ApiModel({
  description: 'Dashboard entity',
  name: 'Dashboard',
})
export class Dashboard {
  @ApiModelProperty({
    description: 'Dashboard ID in uuid format',
    required: false,
  })
  id: string;

  @ApiModelProperty({
    description: 'Name of the dashboard',
    required: true,
  })
  name: string;

  @ApiModelProperty({
    description: 'content of the dashboard stored in json object format',
    required: true,
    type: SwaggerDefinitionConstant.JSON,
  })
  content: object | null;

  @ApiModelProperty({
    description: 'whether the dashboard is removed or not',
    required: false,
  })
  is_removed: boolean;

  @ApiModelProperty({
    description: 'whether the dashboard is preset or not',
    required: false,
  })
  is_preset: boolean;

  @ApiModelProperty({
    description: 'Dashboard group',
    required: false,
  })
  group: string;

  @ApiModelProperty({
    description: 'Create time',
    required: false,
  })
  create_time: Date;

  @ApiModelProperty({
    description: 'Time of last update',
    required: false,
  })
  update_time: Date;

  @ApiModelProperty({
    description: 'Dashboard owner id',
  })
  owner_id: string | null;

  @ApiModelProperty({
    description: 'Dashboard owner type',
  })
  owner_type: 'ACCOUNT' | 'APIKEY' | null;

  @ApiModelProperty({
    description: 'access permissions of the dashboard',
  })
  @Type(() => PermissionResource)
  access: PermissionResource[];
}

@ApiModel({
  description: 'Dashboard filter object',
  name: 'DashboardFilterObject',
})
export class DashboardFilterObject {
  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on name',
    required: false,
    model: 'FilterObject',
  })
  name?: FilterObject;

  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on group',
    required: false,
    model: 'FilterObject',
  })
  group?: FilterObject;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty({
    description: 'filter based on is_removed',
    required: false,
  })
  is_removed?: boolean;
}

@ApiModel({
  description: 'Dashboard sort object',
  name: 'DashboardSortObject',
})
export class DashboardSortObject implements SortRequest {
  @IsIn(['name', 'create_time', 'is_preset', 'group'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['name', 'create_time', 'is_preset', 'group'],
  })
  field: 'name' | 'create_time' | 'is_preset' | 'group';

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
  description: 'Dashboard list request object',
  name: 'DashboardListRequest',
})
export class DashboardListRequest {
  @IsOptional()
  @Type(() => DashboardFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Dashboard filter object',
    required: false,
    model: 'DashboardFilterObject',
  })
  filter?: DashboardFilterObject;

  @Type(() => DashboardSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Dashboard sort object',
    required: true,
    model: 'DashboardSortObject',
  })
  sort: DashboardSortObject[] = [new DashboardSortObject({ field: 'create_time', order: 'ASC' })];

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
  description: 'dashboard pagination response object',
  name: 'DashboardPaginationResponse',
})
export class DashboardPaginationResponse implements PaginationResponse<Dashboard> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'Dashboards',
    model: 'Dashboard',
  })
  data: Dashboard[];
}

@ApiModel({
  description: 'dashboard create request object',
  name: 'DashboardCreateRequest',
})
export class DashboardCreateRequest {
  @IsString()
  @Length(1, 250)
  @ApiModelProperty({
    description: 'Name of the dashboard',
    required: true,
  })
  name: string;

  @IsObject()
  @ApiModelProperty({
    description: 'content of the dashboard stored in json object format',
    required: true,
    type: SwaggerDefinitionConstant.JSON,
  })
  content: Record<string, any>;

  @IsString()
  @ApiModelProperty({
    description: 'Dashboard group',
    required: true,
  })
  group: string;

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
  description: 'dashboard update request object',
  name: 'DashboardUpdateRequest',
})
export class DashboardUpdateRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'Dashboard ID in uuid format',
    required: true,
  })
  id: string;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @ApiModelProperty({
    description: 'Name of the dashboard',
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
  @IsBoolean()
  @ApiModelProperty({
    description: 'Whether the dashboard is removed or not',
    required: false,
  })
  is_removed?: boolean;

  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'Dashboard group',
    required: false,
  })
  group?: string;

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
  description: 'Dashboard ID request',
  name: 'DashboardIDRequest',
})
export class DashboardIDRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'Dashboard uuid',
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
  description: 'Dashboard name request',
  name: 'DashboardNameRequest',
})
export class DashboardNameRequest {
  @IsString()
  @Length(1, 250)
  @ApiModelProperty({
    description: 'Dashboard name',
    required: true,
  })
  name: string;

  @IsBoolean()
  @ApiModelProperty({
    description: 'Dashboard is_preset',
    required: true,
  })
  is_preset: boolean;

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
