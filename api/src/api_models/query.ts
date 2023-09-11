import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { Authentication } from './base';

@ApiModel({
  description: 'Query params object',
  name: 'QueryParams',
})
export class QueryParams {
  @IsObject()
  @ApiModelProperty({
    description: 'Query filter params',
    required: true,
    type: SwaggerDefinitionConstant.JSON,
  })
  filters: Record<string, any>;

  @IsObject()
  @ApiModelProperty({
    description: 'Query context params',
    required: true,
    type: SwaggerDefinitionConstant.JSON,
  })
  context: Record<string, any>;
}

@ApiModel({
  description: 'Query object',
  name: 'QueryRequest',
})
export class QueryRequest {
  @IsIn(['postgresql', 'mysql', 'http'])
  @ApiModelProperty({
    description: 'datasource type of query',
    required: true,
    enum: ['postgresql', 'mysql', 'http'],
  })
  type: 'postgresql' | 'mysql' | 'http';

  @IsString()
  @ApiModelProperty({
    description: 'datasource key',
    required: true,
  })
  key: string;

  @IsString()
  @ApiModelProperty({
    description:
      'query to be executed against selected datasource. For http data sources query must be a json parsable object string',
    required: true,
  })
  query: string;

  @IsString()
  @ApiModelProperty({
    description: 'id of the dashboard content',
    required: true,
  })
  content_id: string;

  @IsString()
  @ApiModelProperty({
    description: 'id of the query defined in dashboard content',
    required: true,
  })
  query_id: string;

  @IsObject()
  @Type(() => QueryParams)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Query params',
    required: true,
    model: 'QueryParams',
  })
  params: QueryParams;

  @IsOptional()
  @IsObject()
  @ApiModelProperty({
    description: 'Query env config',
    required: false,
    type: SwaggerDefinitionConstant.JSON,
  })
  env?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty({
    description: 'refresh cached data',
    required: false,
  })
  refresh_cache?: boolean;

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
  description: 'HTTP Params Object',
  name: 'HttpParams',
})
export class HttpParams {
  @IsOptional()
  @IsString()
  @ApiModelProperty({
    description: 'host',
    required: false,
  })
  host: string;

  @IsIn(['GET', 'POST', 'PUT', 'DELETE'])
  @ApiModelProperty({
    description: 'Request method',
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
  })
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';

  @IsObject()
  @ApiModelProperty({
    description: 'Request parameters',
    required: true,
  })
  data: Record<string, any>;

  @IsObject()
  @ApiModelProperty({
    description: 'Request url parameters',
    required: true,
  })
  params: Record<string, any>;

  @IsObject()
  @ApiModelProperty({
    description: 'Http headers to add to the request',
    required: true,
  })
  headers: Record<string, string>;

  @IsString()
  @ApiModelProperty({
    description:
      'Request URL path. Can be used to target a specific endpoint on the configured hostname or to add url parameters',
    required: true,
  })
  url: string;
}
