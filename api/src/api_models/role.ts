import { IsIn, IsNotIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { FIXED_ROLE_TYPES, PERMISSIONS } from '../services/role.service';
import { Type } from 'class-transformer';
import { Authentication } from './base';

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
    description: 'Role description',
  })
  description: string;

  @ApiModelProperty({
    description: 'Role permissions',
    itemType: 'string',
  })
  permissions: string[];
}

@ApiModel({
  description: 'Create or update role request',
  name: 'RoleCreateOrUpdateRequest',
})
export class RoleCreateOrUpdateRequest {
  @IsString()
  @IsNotIn(Object.values(FIXED_ROLE_TYPES))
  @ApiModelProperty({
    description: 'Role id',
    required: true,
  })
  id: string;

  @IsString()
  @ApiModelProperty({
    description: 'Role description',
    required: true,
  })
  description: string;

  @IsString({ each: true })
  @IsIn(Object.values(PERMISSIONS), { each: true })
  @ApiModelProperty({
    description: 'Role permissions',
    required: true,
    itemType: 'string',
    enum: [Object.values(PERMISSIONS).join(' | ')],
  })
  permissions: string[];

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
  description: 'Role ID request',
  name: 'RoleIDRequest',
})
export class RoleIDRequest {
  @IsString()
  @IsNotIn(Object.values(FIXED_ROLE_TYPES))
  @ApiModelProperty({
    description: 'DataSource uuid',
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
