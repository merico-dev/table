import { Type } from 'class-transformer';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { Authentication, FilterRequest, PaginationRequest, PaginationResponse, SortRequest } from './base';

@ApiModel({
  description: 'Job entity',
  name: 'Job',
})
export class Job {
  @ApiModelProperty({
    description : 'Job ID in uuid format' ,
    required : false,
  })
  id: string;

  @ApiModelProperty({
    description: 'Job type',
    required: true,
  })
  type: string;

  @ApiModelProperty({
    description: 'Job status',
    required: true,
  })
  status: string;

  @ApiModelProperty({
    description: 'Job params',
    required: true,
    type: SwaggerDefinitionConstant.JSON,
  })
  params: object;

  @ApiModelProperty({
    description: 'Job result',
    required: true,
    type: SwaggerDefinitionConstant.JSON,
  })
  result: object;

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
  description: 'Job filter object',
  name: 'JobFilterObject',
})
export class JobFilterObject implements FilterRequest {
  @IsOptional()
  @ApiModelProperty({
    description: 'search term. Uses fuzzy search for type and status fields',
    required: false,
  })
  search?: string;
}

@ApiModel({
  description: 'Job sort object',
  name: 'JobSortObject'
})
export class JobSortObject implements SortRequest {
  @IsIn(['type', 'create_time', 'status'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['type', 'create_time', 'status'],
  })
  field: 'type' | 'create_time' | 'status';

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
  description: 'Job list request object',
  name: 'JobListRequest',
})
export class JobListRequest {
  @IsOptional()
  @Type(() => JobFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Job filter object',
    required: false,
    model: 'JobFilterObject',
  })
  filter?: JobFilterObject;

  @Type(() => JobSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Job sort object',
    required: true,
    model: 'JobSortObject',
  })
  sort: JobSortObject = new JobSortObject({ field: 'create_time', order: 'ASC' });

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
  description: 'Job pagination response object',
  name: 'JobPaginationResponse',
})
export class JobPaginationResponse implements PaginationResponse<Job> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'Jobs',
    model: 'Job',
  })
  data: Job[];
}

@ApiModel({
  description: 'Job run request object',
  name: 'JobRunRequest',
})
export class JobRunRequest {
  @IsIn(['RENAME_DATASOURCE'])
  @ApiModelProperty({
    description: 'Type of job',
    required: true,
    enum: ['RENAME_DATASOURCE'],
  })
  type: 'RENAME_DATASOURCE';

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