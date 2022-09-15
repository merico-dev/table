import { IsIn, IsObject, IsString } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Query object',
  name: 'QueryRequest'
})
export class QueryRequest {
  @IsIn(['postgresql', 'mysql', 'http'])
  @ApiModelProperty({
    description: 'datasource type of query',
    required: true,
    enum: ['postgresql', 'mysql', 'http']
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
    description: 'query to be executed against selected datasource. For http data sources query must be a json parsable object string',
    required: true,
  })
  query: string;
}

@ApiModel({
  description: 'HTTP Params Object',
  name: 'HttpParams'
})
export class HttpParams {
  @IsIn(['GET', 'POST', 'PUT', 'DELETE'])
  @ApiModelProperty({
    description: 'Request method',
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE']
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
    description: 'Http headers to add to the request',
    required: true,
  })
  headers: Record<string, string>;

  @IsString()
  @ApiModelProperty({
    description: 'Request URL postfix. Can be used to target a specific endpoint on the configured hostname or to add url parameters',
    required: true,
  })
  url_postfix: string;
}