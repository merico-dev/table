import { Type } from "class-transformer";
import { IsIn, IsOptional, IsString, ValidateNested } from "class-validator";
import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import { ConfigService } from "../services/config.service";
import { Authentication } from "./base";

@ApiModel({
  description: 'Config entity',
  name: 'Config',
})
export class Config {
  @ApiModelProperty({
    description: 'Key of config',
    required: true,
  })
  key: string;

  @ApiModelProperty({
    description: 'Value of config',
    required: true,
  })
  value: string;
}

@ApiModel({
  description: 'Config update request object',
  name: 'ConfigUpdateRequest',
})
export class ConfigUpdateRequest {
  @IsIn(Object.keys(ConfigService.keyConfig))
  @ApiModelProperty({
    description: 'Key of config',
    required: true,
    enum: Object.keys(ConfigService.keyConfig),
  })
  key: string;

  @IsString()
  @ApiModelProperty({
    description: 'Value of config',
    required: true,
  })
  value: string;

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
  description: 'Config get request object',
  name: 'ConfigGetRequest',
})
export class ConfigGetRequest {
  @IsIn(Object.keys(ConfigService.keyConfig))
  @ApiModelProperty({
    description: 'Key of config',
    required: true,
    enum: Object.keys(ConfigService.keyConfig),
  })
  key: string;

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