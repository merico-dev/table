import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant  } from 'swagger-express-ts';
import { FilterRequest, PaginationRequest, PaginationResponse, SortRequest } from "./base";

@ApiModel({
  description: 'Dashboard entity',
  name: 'Dashboard',
})
export class Dashboard {
  @ApiModelProperty({
    description : "Dashboard ID in uuid format" ,
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
    description : "whether the dashboard is removed or not" ,
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
  @ApiModelProperty({
    description: 'search term. Uses fuzzy search',
    required: false,
  })
  search?: string;

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
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['name', 'create_time'],
  })
  field: 'name' | 'create_time';

  @ApiModelProperty({
    description: 'Sort order',
    required: true,
    enum: ['ASC', 'DESC'],
  })
  order: 'ASC' | 'DESC';
}

@ApiModel({
  description: 'Dashboard list request object',
  name: 'DashboardListRequest',
})
export class DashboardListRequest {
  @ApiModelProperty({
    description: 'Dashboard filter object',
    required: false,
    model: 'DashboardFilterObject',
  })
  filter?: DashboardFilterObject;

  @ApiModelProperty({
    description: 'Dashboard sort object',
    required: true,
    model: 'DashboardSortObject',
  })
  sort: DashboardSortObject;

  @ApiModelProperty({
    description: 'Pagination object',
    required: true,
    model: 'PaginationRequest',
  })
  pagination: PaginationRequest;
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
}

@ApiModel({
  description: 'dashboard update request object',
  name: 'DashboardUpdateRequest',
})
export class DashboardUpdateRequest{
  @ApiModelProperty({
    description : "Dashboard ID in uuid format" ,
    required : true,
  })
  id: string;

  @ApiModelProperty({
    description: 'Name of the dashboard',
    required: false,
  })
  name?: string;

  @ApiModelProperty({
    description: 'content of the dashboard stored in json object format',
    required: false,
    type: SwaggerDefinitionConstant.JSON,
  })
  content?: Record<string, unknown>;

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
  @ApiModelProperty({
    description: 'Dashboard uuid',
    required: true,
  })
  id: string;
}