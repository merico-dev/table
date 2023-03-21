import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Authentication, FilterObject, PaginationRequest, PaginationResponse, SortRequest } from './base';

@ApiModel({
  description: 'Dashboard permission resource object',
  name: 'PermissionResource',
})
export class PermissionResource {
  @IsIn(['ACCOUNT', 'APIKEY'])
  @ApiModelProperty({
    description: 'resource type',
    required: true,
    enum: ['ACCOUNT', 'APIKEY'],
  })
  type: 'ACCOUNT' | 'APIKEY';

  @IsUUID()
  @ApiModelProperty({
    description: 'resource id',
    required: true,
  })
  id: string;
}

@ApiModel({
  description: 'Dashboard Permission entity',
  name: 'DashboardPermission',
})
export class DashboardPermission {
  @ApiModelProperty({
    description: 'Dashboard ID in uuid format',
    required: false,
  })
  dashboard_id: string;

  @ApiModelProperty({
    description: 'owner_id of the dashboard permission',
    required: false,
  })
  owner_id: string | null;

  @ApiModelProperty({
    description: 'owner_type of the dashboard permission',
    required: false,
  })
  owner_type: string | null;

  @ApiModelProperty({
    description: 'can view permissions of the dashboard',
    required: false,
  })
  @Type(() => PermissionResource)
  can_view: PermissionResource[];

  @ApiModelProperty({
    description: 'can edit permissions of the dashboard',
    required: false,
  })
  @Type(() => PermissionResource)
  can_edit: PermissionResource[];

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
}

@ApiModel({
  description: 'Dashboard Permission filter object',
  name: 'DashboardPermissionFilterObject',
})
export class DashboardPermissionFilterObject {
  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on dashboard_id. isFuzzy is ignored and always filters on exact match',
    required: false,
    model: 'FilterObject',
  })
  dashboard_id?: FilterObject;

  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on owner_id. isFuzzy is ignored and always filters on exact match',
    required: false,
    model: 'FilterObject',
  })
  owner_id?: FilterObject;

  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on owner_type',
    required: false,
    model: 'FilterObject',
  })
  owner_type?: FilterObject;
}

@ApiModel({
  description: 'Dashboard Permission sort object',
  name: 'DashboardPermissionSortObject',
})
export class DashboardPermissionSortObject implements SortRequest {
  @IsIn(['dashboard_id', 'create_time', 'owner_id', 'owner_type'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['dashboard_id', 'create_time', 'owner_id', 'owner_type'],
  })
  field: 'dashboard_id' | 'create_time' | 'owner_id' | 'owner_type';

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
  description: 'Dashboard Permission list request object',
  name: 'DashboardPermissionListRequest',
})
export class DashboardPermissionListRequest {
  @IsOptional()
  @Type(() => DashboardPermissionFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Dashboard Permission filter object',
    required: false,
    model: 'DashboardPermissionFilterObject',
  })
  filter?: DashboardPermissionFilterObject;

  @Type(() => DashboardPermissionSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Dashboard Permission sort object',
    required: true,
    model: 'DashboardPermissionSortObject',
  })
  sort: DashboardPermissionSortObject[] = [new DashboardPermissionSortObject({ field: 'create_time', order: 'ASC' })];

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
  description: 'dashboard permission pagination response object',
  name: 'DashboardPermissionPaginationResponse',
})
export class DashboardPermissionPaginationResponse implements PaginationResponse<DashboardPermission> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'Dashboard Permissions',
    model: 'DashboardPermission',
  })
  data: DashboardPermission[];
}

@ApiModel({
  description: 'dashboard owner update request',
  name: 'DashboardOwnerUpdateRequest',
})
export class DashboardOwnerUpdateRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'Dashboard ID',
    required: true,
  })
  dashboard_id: string;

  @IsIn(['ACCOUNT', 'APIKEY'])
  @ApiModelProperty({
    description: 'owner type',
    required: true,
    enum: ['ACCOUNT', 'APIKEY'],
  })
  owner_type: 'ACCOUNT' | 'APIKEY';

  @IsUUID()
  @ApiModelProperty({
    description: 'owner id',
    required: true,
  })
  owner_id: string;

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
  description: 'dashboard permission update request',
  name: 'DashboardPermissionUpdateRequest',
})
export class DashboardPermissionUpdateRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'Dashboard ID',
    required: true,
  })
  dashboard_id: string;

  @IsIn(['ADD', 'REMOVE'])
  @ApiModelProperty({
    description: 'Modification direction. ADD or REMOVE',
    required: true,
    enum: ['ADD', 'REMOVE'],
  })
  direction: 'ADD' | 'REMOVE';

  @ApiModelProperty({
    description: 'can view permissions of the dashboard',
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => PermissionResource)
  can_view: PermissionResource[];

  @ApiModelProperty({
    description: 'can edit permissions of the dashboard',
    required: true,
  })
  @ValidateNested({ each: true })
  @Type(() => PermissionResource)
  can_edit: PermissionResource[];

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
