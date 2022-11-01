import { dashboardDataSource } from '../data_sources/dashboard';
import { BinaryLike, createHmac } from 'crypto';
import bcrypt from 'bcrypt';
import { ApiKey as ApiKeyModel,  ApiKeyFilterObject, ApiKeyPaginationResponse, ApiKeySortObject } from "../api_models/api";
import { PaginationRequest } from "../api_models/base";
import ApiKey from '../models/apiKey';
import { SALT_ROUNDS, SECRET_KEY } from '../utils/constants';
import logger from 'npmlog';

export class ApiService {
  static async verifyApiKey(apiKey: string | string[] | undefined, domain: string | undefined): Promise<ApiKeyModel | null> {
    if (!apiKey || !domain) {
      return null;
    }
    if (apiKey instanceof Array) {
      apiKey = apiKey[0];
    }
    try {
      const apiKeyRepo = dashboardDataSource.getRepository(ApiKey);
      const apiKeys = await apiKeyRepo.findBy({ domain });
      for (let i = 0; i < apiKeys.length; i++) {
        if (await bcrypt.compare(apiKey, apiKeys[i].key)) {
          return apiKeys[i];
        }
      }
      return null;
    } catch (err) {
      logger.warn(err);
      return null;
    }
  }

  async listKeys(filter: ApiKeyFilterObject | undefined, sort: ApiKeySortObject, pagination: PaginationRequest): Promise<ApiKeyPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager.createQueryBuilder()
      .from(ApiKey, 'apikey')
      .select('apikey.id', 'id')
      .addSelect('apikey.name', 'name')
      .addSelect('apikey.domain', 'domain')
      .addSelect('apikey.role_id', 'role_id')
      .orderBy(sort.field, sort.order)
      .offset(offset).limit(pagination.pagesize);

    if (filter?.search) {
      qb.where('apikey.name ilike :nameSearch OR apikey.domain ilike :domainSearch', { nameSearch: `%${filter.search}%`, domainSearch: `%${filter.search}%` });
    }

    const datasources = await qb.getRawMany<ApiKey>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: datasources,
    };
  }

  async createKey(name: string, domain: string, role_id: number): Promise<string> {
    const apiKeyRepo = dashboardDataSource.getRepository(ApiKey);
    const apiKey = new ApiKey();
    apiKey.name = name;
    apiKey.domain = domain;
    apiKey.role_id = role_id;
    const key = createHmac('sha256', SECRET_KEY as BinaryLike).update(name).digest('hex');
    apiKey.key = await bcrypt.hash(key, SALT_ROUNDS);
    await apiKeyRepo.save(apiKey);
    return key;
  }

  async deleteKey(id: string): Promise<void> {
    const apiKeyRepo = dashboardDataSource.getRepository(ApiKey);
    const apiKey = await apiKeyRepo.findOneByOrFail({ id });
    await apiKeyRepo.delete(apiKey.id);
  }
}