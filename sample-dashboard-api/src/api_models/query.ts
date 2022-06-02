import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel({
  description: 'Query object',
  name: 'QueryRequest'
})
export class QueryRequest {
  @ApiModelProperty({
    description: 'datasource type of query',
    required: true,
    enum: ['postgresql']
  })
  type: 'postgresql';

  @ApiModelProperty({
    description: 'datasource key',
    required: true,
  })
  key: string;

  @ApiModelProperty({
    description: 'query to be executed against selected datasource',
    required: true,
  })
  sql: string;
}