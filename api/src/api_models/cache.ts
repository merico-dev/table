import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Cache clear request object',
  name: 'CacheClearRequest',
})
export class CacheClearRequest {
  @ApiModelProperty({
    description: 'Content id',
    required: true,
  })
  content_id: string;
}
