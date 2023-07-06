import { Type } from 'class-transformer';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Authentication, FilterObject, PaginationRequest, PaginationResponse, SortRequest } from './base';

@ApiModel({
  description: 'DashboardChangelog entity',
  name: 'DashboardChangelog',
})
export class DashboardChangelog {
  @ApiModelProperty({
    description: 'changelog ID in uuid format',
  })
  id: string;

  @ApiModelProperty({
    description: 'ID of the related dashboard in uuid format',
  })
  dashboard_id: string;

  @ApiModelProperty({
    description: 'git diff of the changes',
  })
  diff: string;

  @ApiModelProperty({
    description: 'Create time',
  })
  create_time: Date;
}

@ApiModel({
  description: 'DashboardChangelog filter object',
  name: 'DashboardChangelogFilterObject',
})
export class DashboardChangelogFilterObject {
  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on dashboard_id. isFuzzy is ignored and always filters on exact match',
    required: false,
    model: 'FilterObject',
  })
  dashboard_id?: FilterObject;
}

@ApiModel({
  description: 'DashboardChangelog sort object',
  name: 'DashboardChangelogSortObject',
})
export class DashboardChangelogSortObject implements SortRequest {
  @IsIn(['dashboard_id', 'create_time'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['dashboard_id', 'create_time'],
  })
  field: 'dashboard_id' | 'create_time';

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
  description: 'DashboardChangelog list request object',
  name: 'DashboardChangelogListRequest',
})
export class DashboardChangelogListRequest {
  @IsOptional()
  @Type(() => DashboardChangelogFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'DashboardChangelog filter object',
    required: false,
    model: 'DashboardChangelogFilterObject',
  })
  filter?: DashboardChangelogFilterObject;

  @Type(() => DashboardChangelogSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'DashboardChangelog sort object',
    required: true,
    model: 'DashboardChangelogSortObject',
  })
  sort: DashboardChangelogSortObject[] = [new DashboardChangelogSortObject({ field: 'create_time', order: 'ASC' })];

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
  description: 'DashboardChangelog pagination response object',
  name: 'DashboardChangelogPaginationResponse',
})
export class DashboardChangelogPaginationResponse implements PaginationResponse<DashboardChangelog> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'DashboardChangelogs',
    model: 'DashboardChangelog',
  })
  data: DashboardChangelog[];
}
