import { IsIn, IsString } from "class-validator";
import { ApiModel, ApiModelProperty } from "swagger-express-ts";

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
    description: 'query to be executed against selected datasource',
    required: true,
  })
  query: string;
}