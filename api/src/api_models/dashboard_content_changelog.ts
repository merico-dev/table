import { Type } from 'class-transformer';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Authentication, FilterObject, PaginationRequest, PaginationResponse, SortRequest } from './base';

@ApiModel({
  description: 'DashboardContentChangelog entity',
  name: 'DashboardContentChangelog',
})
export class DashboardContentChangelog {
  @ApiModelProperty({
    description: 'changelog ID in uuid format',
    required: false,
  })
  id: string;

  @ApiModelProperty({
    description: 'ID of the related dashboard content in uuid format',
    required: true,
  })
  dashboard_content_id: string;

  @ApiModelProperty({
    description: 'git diff of the changes',
    required: true,
  })
  diff: string;

  @ApiModelProperty({
    description: 'Create time',
    required: false,
  })
  create_time: Date;
}

@ApiModel({
  description: 'DashboardContentChangelog filter object',
  name: 'DashboardContentChangelogFilterObject',
})
export class DashboardContentChangelogFilterObject {
  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on dashboard_content_id. isFuzzy is ignored and always filters on exact match',
    required: false,
    model: 'FilterObject',
  })
  dashboard_content_id?: FilterObject;
}

@ApiModel({
  description: 'DashboardContentChangelog sort object',
  name: 'DashboardContentChangelogSortObject',
})
export class DashboardContentChangelogSortObject implements SortRequest {
  @IsIn(['dashboard_content_id', 'create_time'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['dashboard_content_id', 'create_time'],
  })
  field: 'dashboard_content_id' | 'create_time';

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
  description: 'DashboardContentChangelog list request object',
  name: 'DashboardContentChangelogListRequest',
})
export class DashboardContentChangelogListRequest {
  @IsOptional()
  @Type(() => DashboardContentChangelogFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'DashboardContentChangelog filter object',
    required: false,
    model: 'DashboardContentChangelogFilterObject',
  })
  filter?: DashboardContentChangelogFilterObject;

  @Type(() => DashboardContentChangelogSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'DashboardContentChangelog sort object',
    required: true,
    model: 'DashboardContentChangelogSortObject',
  })
  sort: DashboardContentChangelogSortObject[] = [
    new DashboardContentChangelogSortObject({ field: 'create_time', order: 'ASC' }),
  ];

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
  description: 'DashboardContentChangelog pagination response object',
  name: 'DashboardContentChangelogPaginationResponse',
})
export class DashboardContentChangelogPaginationResponse implements PaginationResponse<DashboardContentChangelog> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'DashboardContentChangelogs',
    model: 'DashboardContentChangelog',
  })
  data: DashboardContentChangelog[];
}
