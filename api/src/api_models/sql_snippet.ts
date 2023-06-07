import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsString, IsOptional, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { Authentication, FilterObject, PaginationRequest, PaginationResponse, SortRequest } from './base';

@ApiModel({
  description: 'Sql snippet entity',
  name: 'SqlSnippet',
})
export class SqlSnippet {
  @ApiModelProperty({
    description: 'Sql snippet id',
  })
  id: string;

  @ApiModelProperty({
    description: 'sql snippet content',
  })
  content: string;

  @ApiModelProperty({
    description: 'whether the sql snippet is preset or not',
  })
  is_preset: boolean;

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
  description: 'Sql snippet filter object',
  name: 'SqlSnippetFilterObject',
})
export class SqlSnippetFilterObject {
  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on id',
    required: false,
    model: 'FilterObject',
  })
  id?: FilterObject;
}

@ApiModel({
  description: 'Sql snippet sort object',
  name: 'SqlSnippetSortObject',
})
export class SqlSnippetSortObject implements SortRequest {
  @IsIn(['id', 'create_time', 'update_time', 'is_preset'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['id', 'create_time', 'update_time', 'is_preset'],
  })
  field: 'id' | 'create_time' | 'update_time' | 'is_preset';

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
  description: 'Sql snippet list request object',
  name: 'SqlSnippetListRequest',
})
export class SqlSnippetListRequest {
  @IsOptional()
  @Type(() => SqlSnippetFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Sql snippet filter object',
    required: false,
    model: 'SqlSnippetFilterObject',
  })
  filter?: SqlSnippetFilterObject;

  @Type(() => SqlSnippetSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Sql snippet sort object',
    required: true,
    model: 'SqlSnippetSortObject',
  })
  sort: SqlSnippetSortObject[] = [new SqlSnippetSortObject({ field: 'id', order: 'ASC' })];

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
  description: 'Sql snippet pagination response object',
  name: 'SqlSnippetPaginationResponse',
})
export class SqlSnippetPaginationResponse implements PaginationResponse<SqlSnippet> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'Sql snippets',
    model: 'SqlSnippet',
  })
  data: SqlSnippet[];
}

@ApiModel({
  description: 'Sql snippet create or update request object',
  name: 'SqlSnippetCreateOrUpdateRequest',
})
export class SqlSnippetCreateOrUpdateRequest {
  @IsString()
  @ApiModelProperty({
    description: 'Name of the sql snippet',
    required: true,
  })
  id: string;

  @IsString()
  @ApiModelProperty({
    description: 'Sql snippet content',
    required: true,
  })
  content: string;

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
  description: 'Sql snippet ID request',
  name: 'SqlSnippetIDRequest',
})
export class SqlSnippetIDRequest {
  @IsString()
  @ApiModelProperty({
    description: 'Sql snippet id',
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
