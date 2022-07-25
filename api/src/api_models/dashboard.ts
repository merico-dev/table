import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant  } from 'swagger-express-ts';
import { IsObject, Length, IsString, IsOptional, ValidateNested, IsUUID, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterRequest, PaginationRequest, PaginationResponse, SortRequest } from './base';

@ApiModel({
  description: 'Dashboard entity',
  name: 'Dashboard',
})
export class Dashboard {
  @ApiModelProperty({
    description : 'Dashboard ID in uuid format' ,
    required : false,
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
    description : 'whether the dashboard is removed or not' ,
    required : false,
  })
  is_removed: boolean;

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
  description: 'Dashboard filter object',
  name: 'DashboardFilterObject',
})
export class DashboardFilterObject implements FilterRequest {
  @IsOptional()
  @ApiModelProperty({
    description: 'search term. Uses fuzzy search',
    required: false,
  })
  search?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'REMOVED', 'ALL'])
  @ApiModelProperty({
    description: 'Types of dashboards to select',
    required: false,
    enum: ['ACTIVE', 'REMOVED', 'ALL'],
  })
  selection?: 'ACTIVE' | 'REMOVED' | 'ALL';
}

@ApiModel({
  description: 'Dashboard sort object',
  name: 'DashboardSortObject'
})
export class DashboardSortObject implements SortRequest {
  @IsIn(['name', 'create_time'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['name', 'create_time'],
  })
  field: 'name' | 'create_time';

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
  sort: DashboardSortObject = new DashboardSortObject({ field: 'create_time', order: 'ASC' });

  @Type(() => PaginationRequest)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Pagination object',
    required: true,
    model: 'PaginationRequest',
  })
  pagination: PaginationRequest = new PaginationRequest({ page: 1, pagesize: 20 });
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
}

@ApiModel({
  description: 'dashboard update request object',
  name: 'DashboardUpdateRequest',
})
export class DashboardUpdateRequest{
  @IsUUID()
  @ApiModelProperty({
    description : 'Dashboard ID in uuid format' ,
    required : true,
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
}