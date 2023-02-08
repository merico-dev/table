import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

export enum ROLE_TYPES {
  INACTIVE = 10,
  READER = 20,
  AUTHOR = 30,
  ADMIN = 40,
  SUPERADMIN = 50,
}

@ApiModel({
  description: 'Role entity',
  name: 'Role',
})
export class Role {
  @ApiModelProperty({
    description: 'Role ID',
  })
  id: string;

  @ApiModelProperty({
    description: 'Role name',
  })
  name: string;

  @ApiModelProperty({
    description: 'Role description',
  })
  description: string;
}
