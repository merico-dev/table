import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsString, IsOptional, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { Authentication, FilterObject, PaginationRequest, PaginationResponse, SortRequest } from './base';

@ApiModel({
  description: 'Custom Function entity',
  name: 'CustomFunction',
})
export class CustomFunction {
  @ApiModelProperty({
    description: 'Custom Function id',
  })
  id: string;

  @ApiModelProperty({
    description: 'Custom Function definition',
  })
  definition: string;

  @ApiModelProperty({
    description: 'whether the custom function is preset or not',
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
  description: 'Custom Function filter object',
  name: 'CustomFunctionFilterObject',
})
export class CustomFunctionFilterObject {
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
  description: 'Custom Function sort object',
  name: 'CustomFunctionSortObject',
})
export class CustomFunctionSortObject implements SortRequest {
  @IsIn(['id', 'create_time', 'is_preset'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['id', 'create_time', 'is_preset'],
  })
  field: 'id' | 'create_time' | 'is_preset';

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
  description: 'Custom Function list request object',
  name: 'CustomFunctionListRequest',
})
export class CustomFunctionListRequest {
  @IsOptional()
  @Type(() => CustomFunctionFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Custom Function filter object',
    required: false,
    model: 'CustomFunctionFilterObject',
  })
  filter?: CustomFunctionFilterObject;

  @Type(() => CustomFunctionSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Custom Function sort object',
    required: true,
    model: 'CustomFunctionSortObject',
  })
  sort: CustomFunctionSortObject[] = [new CustomFunctionSortObject({ field: 'id', order: 'ASC' })];

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
  description: 'Custom Function pagination response object',
  name: 'CustomFunctionPaginationResponse',
})
export class CustomFunctionPaginationResponse implements PaginationResponse<CustomFunction> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'Custom Functions',
    model: 'CustomFunction',
  })
  data: CustomFunction[];
}

@ApiModel({
  description: 'Custom Function create or update request object',
  name: 'CustomFunctionCreateOrUpdateRequest',
})
export class CustomFunctionCreateOrUpdateRequest {
  @IsString()
  @ApiModelProperty({
    description: 'Name of the custom function',
    required: true,
  })
  id: string;

  @IsString()
  @ApiModelProperty({
    description: 'Custom Function definition',
    required: true,
  })
  definition: string;

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
  description: 'Custom Function ID request',
  name: 'CustomFunctionIDRequest',
})
export class CustomFunctionIDRequest {
  @IsString()
  @ApiModelProperty({
    description: 'Custom Function id',
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
