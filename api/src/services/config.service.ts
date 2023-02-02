import { dashboardDataSource } from '../data_sources/dashboard';
import { Account } from '../api_models/account';
import ApiKey from '../models/apiKey';
import Config from '../models/config';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import { FindOptionsWhere } from 'typeorm';
import { DEFAULT_LANGUAGE } from '../utils/constants';
import i18n from '../utils/i18n';

export enum ConfigResourceTypes {
  GLOBAL = 'GLOBAL',
  ACCOUNT = 'ACCOUNT',
  APIKEY = 'APIKEY',
}

type KeyConfig = {
  [key: string]: KeyConfigProperties,
}

type KeyConfigProperties = {
  requiresAuth: boolean,
  default: string,
  acceptedValues?: string[]
}

export class ConfigService {
  static keyConfig: KeyConfig = {
    'lang': {
      requiresAuth: true,
      default: DEFAULT_LANGUAGE,
      acceptedValues: i18n.getLocales()
    }
  };

  static async delete(key: string, resource_type: ConfigResourceTypes, resource_id: string): Promise<void> {
    const configRepo = dashboardDataSource.getRepository(Config);
    await configRepo.delete({ key, resource_id, resource_type });
  }

  async get(key: string, auth: Account | ApiKey | undefined): Promise<{ key: string, value: string }> {
    const where: FindOptionsWhere<Config> = { key, resource_type: ConfigResourceTypes.GLOBAL };
    const keyConfig = ConfigService.keyConfig[key];
    if (keyConfig.requiresAuth) {
      if (!auth) {
        return { key, value: keyConfig.default };
      }
      where.resource_type = auth instanceof ApiKey ? ConfigResourceTypes.APIKEY : ConfigResourceTypes.ACCOUNT;
      where.resource_id = auth.id; 
    }

    const configRepo = dashboardDataSource.getRepository(Config);
    const config = await configRepo.findOneBy(where);
    if (!config) {
      return { key, value: keyConfig.default };
    }
    return { key, value: config.value };
  }

  async update(key: string, value: string, auth: Account | ApiKey | undefined, locale: string): Promise<{ key: string, value: string }> {
    const where: FindOptionsWhere<Config> = { key, resource_type: ConfigResourceTypes.GLOBAL };
    const keyConfig = ConfigService.keyConfig[key];
    if (keyConfig.requiresAuth) {
      if (!auth) {
        throw new ApiError(BAD_REQUEST, { message: i18n.__({ phrase: 'Must be authenticated for this config', locale }) });
      }
      where.resource_type = auth instanceof ApiKey ? ConfigResourceTypes.APIKEY : ConfigResourceTypes.ACCOUNT;
      where.resource_id = auth.id; 
    }

    this.validateKey(keyConfig, value, locale);

    const configRepo = dashboardDataSource.getRepository(Config);
    let config = await configRepo.findOneBy(where);
    if (!config) {
      config = new Config();
      config.key = key;
      config.resource_type = ConfigResourceTypes.GLOBAL;
      if (keyConfig.requiresAuth) {
        config.resource_type = auth instanceof ApiKey ? ConfigResourceTypes.APIKEY : ConfigResourceTypes.ACCOUNT;
        config.resource_id = auth!.id; 
      }
    }
    config.value = value;
    const result = await configRepo.save(config);
    return { key, value: result.value };
  }

  private validateKey(keyConfig: KeyConfigProperties, value: string, locale: string) {
    if (keyConfig.acceptedValues && !keyConfig.acceptedValues.includes(value)) throw new ApiError(BAD_REQUEST, { message: i18n.__({ phrase: 'Incorrect value', locale }), acceptedValues: keyConfig.acceptedValues });
  }
}