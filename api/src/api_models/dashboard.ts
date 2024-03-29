import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Length, IsString, IsOptional, ValidateNested, IsUUID, IsBoolean, IsIn, ValidateIf } from 'class-validator';
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
  })
  id: string;

  @ApiModelProperty({
    description: 'Name of the dashboard',
  })
  name: string;

  @ApiModelProperty({
    description: 'dashboard content ID in uuid format',
  })
  content_id: string | null;

  @ApiModelProperty({
    description: 'whether the dashboard is removed or not',
  })
  is_removed: boolean;

  @ApiModelProperty({
    description: 'whether the dashboard is preset or not',
  })
  is_preset: boolean;

  @ApiModelProperty({
    description: 'Dashboard group',
  })
  group: string;

  @ApiModelProperty({
    description: 'Create time',
  })
  create_time: Date;

  @ApiModelProperty({
    description: 'Time of last update',
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

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty({
    description: 'filter based on is_preset',
    required: false,
  })
  is_preset?: boolean;
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
  @IsUUID()
  @ValidateIf((_object, value) => value !== null)
  @ApiModelProperty({
    description: 'dashboard content ID in uuid format',
    required: false,
  })
  content_id?: string | null;

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
