import { dashboardDataSource } from '../data_sources/dashboard';
import crypto from 'crypto';
import {
  ApiKey as ApiKeyModel,
  ApiKeyFilterObject,
  ApiKeyPaginationResponse,
  ApiKeySortObject,
} from '../api_models/api';
import { Authentication, PaginationRequest } from '../api_models/base';
import ApiKey from '../models/apiKey';
import { cryptSign, escapeLikePattern } from '../utils/helpers';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import { ConfigResourceTypes, ConfigService } from './config.service';
import { translate } from '../utils/i18n';

export class ApiService {
  static async verifyApiKey(authentication: Authentication | undefined, rest: any): Promise<ApiKeyModel | null> {
    if (!authentication || !authentication.app_id) {
      return null;
    }
    const apiKeyRepo = dashboardDataSource.getRepository(ApiKey);
    const apiKey = await apiKeyRepo.findOneBy({ app_id: authentication.app_id });
    if (!apiKey) {
      return null;
    }
    const validSign = cryptSign(
      { app_id: authentication.app_id, nonce_str: authentication.nonce_str, ...rest },
      apiKey.app_secret,
    );
    if (validSign === authentication.sign) {
      return apiKey;
    }
    return null;
  }

  async listKeys(
    filter: ApiKeyFilterObject | undefined,
    sort: ApiKeySortObject[],
    pagination: PaginationRequest,
  ): Promise<ApiKeyPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(ApiKey, 'apikey')
      .select('apikey.id', 'id')
      .addSelect('apikey.name', 'name')
      .addSelect('apikey.app_id', 'app_id')
      .addSelect('apikey.app_secret', 'app_secret')
      .addSelect('apikey.role_id', 'role_id')
      .addSelect('apikey.is_preset', 'is_preset')
      .where('true')
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    if (filter?.name) {
      filter.name.isFuzzy
        ? qb.andWhere('apikey.name ilike :name', { name: `%${escapeLikePattern(filter.name.value)}%` })
        : qb.andWhere('apikey.name = :name', { name: filter.name.value });
    }

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const datasources = await qb.getRawMany<ApiKey>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: datasources,
    };
  }

  async createKey(name: string, role_id: number, locale: string): Promise<{ app_id: string; app_secret: string }> {
    const apiKeyRepo = dashboardDataSource.getRepository(ApiKey);
    if (await apiKeyRepo.exist({ where: { name, is_preset: false } })) {
      throw new ApiError(BAD_REQUEST, { message: translate('APIKEY_NAME_ALREADY_EXISTS', locale) });
    }
    const apiKey = new ApiKey();
    apiKey.name = name;
    apiKey.role_id = role_id;
    apiKey.app_id = crypto.randomBytes(8).toString('hex');
    apiKey.app_secret = crypto.randomBytes(16).toString('hex');
    await apiKeyRepo.save(apiKey);
    return { app_id: apiKey.app_id, app_secret: apiKey.app_secret };
  }

  async deleteKey(id: string, locale: string): Promise<void> {
    const apiKeyRepo = dashboardDataSource.getRepository(ApiKey);
    const apiKey = await apiKeyRepo.findOneByOrFail({ id });
    if (apiKey.is_preset) {
      throw new ApiError(BAD_REQUEST, { message: translate('APIKEY_NO_DELETE_PRESET', locale) });
    }
    await apiKeyRepo.delete(apiKey.id);
    await ConfigService.delete('lang', ConfigResourceTypes.APIKEY, apiKey.id);
  }
}
