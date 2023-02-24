import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsOptional, IsIn, ValidateNested, IsString, Length, IsUUID, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { SortRequest, PaginationRequest, PaginationResponse, Authentication, FilterObject } from './base';
import { ROLE_TYPES } from './role';

@ApiModel({
  description: 'Account entity',
  name: 'Account',
})
export class Account {
  @ApiModelProperty({
    description: 'Account ID in uuid format',
    required: false,
  })
  id: string;

  @ApiModelProperty({
    description: 'Account name',
    required: true,
  })
  name: string;

  @ApiModelProperty({
    description: 'Account email',
    required: false,
  })
  email?: string | null;

  @ApiModelProperty({
    description: 'Account role ID',
    required: true,
  })
  role_id: number;

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
  description: 'Login request object',
  name: 'AccountLoginRequest',
})
export class AccountLoginRequest {
  @IsString()
  @ApiModelProperty({
    description: 'Account name or email',
    required: true,
  })
  name: string;

  @IsString()
  @ApiModelProperty({
    description: 'password',
    required: true,
  })
  password: string;
}

@ApiModel({
  description: 'Login entity',
  name: 'AccountLoginResponse',
})
export class AccountLoginResponse {
  @Type(() => Account)
  @ApiModelProperty({
    description: 'Account',
    model: 'Account',
  })
  account: Account;

  @ApiModelProperty({
    description: 'JWT token',
  })
  token: string;
}

@ApiModel({
  description: 'Account filter object',
  name: 'AccountFilterObject',
})
export class AccountFilterObject {
  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on name',
    required: false,
    model: 'FilterObject',
  })
  name?: FilterObject;

  @IsOptional()
  @Type(() => FilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Filter based on email',
    required: false,
    model: 'FilterObject',
  })
  email?: FilterObject;
}

@ApiModel({
  description: 'Account sort object',
  name: 'AccountSortObject',
})
export class AccountSortObject implements SortRequest {
  @IsIn(['name', 'email', 'create_time'])
  @ApiModelProperty({
    description: 'Field for sorting',
    required: true,
    enum: ['name', 'email', 'create_time'],
  })
  field: 'name' | 'email' | 'create_time';

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
  description: 'Account list request object',
  name: 'AccountListRequest',
})
export class AccountListRequest {
  @IsOptional()
  @Type(() => AccountFilterObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Account filter object',
    required: false,
    model: 'AccountFilterObject',
  })
  filter?: AccountFilterObject;

  @Type(() => AccountSortObject)
  @ValidateNested({ each: true })
  @ApiModelProperty({
    description: 'Account sort object',
    required: true,
    model: 'AccountSortObject',
  })
  sort: AccountSortObject[] = [new AccountSortObject({ field: 'create_time', order: 'ASC' })];

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
  description: 'Account pagination response object',
  name: 'AccountPaginationResponse',
})
export class AccountPaginationResponse implements PaginationResponse<Account> {
  @ApiModelProperty({
    description: 'Total number results',
  })
  total: number;

  @ApiModelProperty({
    description: 'Current offset of results',
  })
  offset: number;

  @ApiModelProperty({
    description: 'Accounts',
    model: 'Account',
  })
  data: Account[];
}

@ApiModel({
  description: 'Account create request object',
  name: 'AccountCreateRequest',
})
export class AccountCreateRequest {
  @IsString()
  @Length(1, 100)
  @ApiModelProperty({
    description: 'Account name',
    required: true,
  })
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiModelProperty({
    description: 'Account email',
    required: false,
  })
  email?: string;

  @IsString()
  @Length(8)
  @ApiModelProperty({
    description: 'Account password',
    required: true,
  })
  password: string;

  @IsInt()
  @IsIn([ROLE_TYPES.INACTIVE, ROLE_TYPES.READER, ROLE_TYPES.AUTHOR, ROLE_TYPES.ADMIN])
  @ApiModelProperty({
    description: 'Account ID',
    required: true,
    enum: [
      ROLE_TYPES.INACTIVE.toString(),
      ROLE_TYPES.READER.toString(),
      ROLE_TYPES.AUTHOR.toString(),
      ROLE_TYPES.ADMIN.toString(),
    ],
  })
  role_id: ROLE_TYPES.INACTIVE | ROLE_TYPES.READER | ROLE_TYPES.AUTHOR | ROLE_TYPES.ADMIN;
}

@ApiModel({
  description: 'Account update request object',
  name: 'AccountUpdateRequest',
})
export class AccountUpdateRequest {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @ApiModelProperty({
    description: 'Account name',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiModelProperty({
    description: 'Account email',
    required: false,
  })
  email?: string;
}

@ApiModel({
  description: 'Account edit request object used by admins to edit other users',
  name: 'AccountEditRequest',
})
export class AccountEditRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'Account ID in uuid format',
    required: true,
  })
  id: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @ApiModelProperty({
    description: 'Account name',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiModelProperty({
    description: 'Account email',
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsInt()
  @IsIn([ROLE_TYPES.INACTIVE, ROLE_TYPES.READER, ROLE_TYPES.AUTHOR, ROLE_TYPES.ADMIN])
  @ApiModelProperty({
    description: 'Account ID',
    required: false,
    enum: [
      ROLE_TYPES.INACTIVE.toString(),
      ROLE_TYPES.READER.toString(),
      ROLE_TYPES.AUTHOR.toString(),
      ROLE_TYPES.ADMIN.toString(),
    ],
  })
  role_id?: ROLE_TYPES.INACTIVE | ROLE_TYPES.READER | ROLE_TYPES.AUTHOR | ROLE_TYPES.ADMIN;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty({
    description: 'Reset account password',
    required: false,
  })
  reset_password?: boolean;

  @IsOptional()
  @IsString()
  @Length(8)
  @ApiModelProperty({
    description: 'Account password',
    required: false,
  })
  new_password?: string;
}

@ApiModel({
  description: 'Account change password request object',
  name: 'AccountChangePasswordRequest',
})
export class AccountChangePasswordRequest {
  @IsString()
  @ApiModelProperty({
    description: 'Account old password',
    required: true,
  })
  old_password: string;

  @IsString()
  @ApiModelProperty({
    description: 'Account new password',
    required: true,
  })
  new_password: string;
}

@ApiModel({
  description: 'Account ID request',
  name: 'AccountIDRequest',
})
export class AccountIDRequest {
  @IsUUID()
  @ApiModelProperty({
    description: 'Account uuid',
    required: true,
  })
  id: string;
}
