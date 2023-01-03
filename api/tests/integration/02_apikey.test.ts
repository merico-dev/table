import { connectionHook } from './jest.util';
import { ApiService } from '../../src/services/api.service';
import { notFoundId } from './constants';
import { ROLE_TYPES } from '~/api_models/role';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { cryptSign } from '~/utils/helpers';
import ApiKey from '~/models/apiKey';
import { dashboardDataSource } from '~/data_sources/dashboard';

describe('ApiService', () => {
  connectionHook();
  let apiService: ApiService;
  let apiKeys: ApiKey[];
  let deletedKeyId: string;

  beforeAll(async () => {
    apiService = new ApiService();
    apiKeys = await dashboardDataSource.manager.find(ApiKey, { order: { name: 'ASC' } });
  });

  describe('createKey', () => {
    it('should create successfully', async () => {
      await apiService.createKey('apiKey6', ROLE_TYPES.ADMIN);
    });

    it('should fail if duplicate name', async () => {
      await expect(apiService.createKey('apiKey6', ROLE_TYPES.ADMIN)).rejects.toThrowError(QueryFailedError);
    });
  });

  describe('listKeys', () => {
    it('no filters', async () => {
      const keys = await apiService.listKeys(undefined, { field: 'name', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(keys).toMatchObject({
        total: 6,
        offset: 0,
        data: [
          {
            id: apiKeys[0].id,
            name: apiKeys[0].name,
            app_id: apiKeys[0].app_id,
            app_secret: apiKeys[0].app_secret,
            role_id: apiKeys[0].role_id,
            is_preset: apiKeys[0].is_preset,
          },
          {
            id: apiKeys[1].id,
            name: apiKeys[1].name,
            app_id: apiKeys[1].app_id,
            app_secret: apiKeys[1].app_secret,
            role_id: apiKeys[1].role_id,
            is_preset: apiKeys[1].is_preset,
          },
          {
            id: apiKeys[2].id,
            name: apiKeys[2].name,
            app_id: apiKeys[2].app_id,
            app_secret: apiKeys[2].app_secret,
            role_id: apiKeys[2].role_id,
            is_preset: apiKeys[2].is_preset,
          },
          {
            id: apiKeys[3].id,
            name: apiKeys[3].name,
            app_id: apiKeys[3].app_id,
            app_secret: apiKeys[3].app_secret,
            role_id: apiKeys[3].role_id,
            is_preset: apiKeys[3].is_preset,
          },
          {
            id: apiKeys[4].id,
            name: apiKeys[4].name,
            app_id: apiKeys[4].app_id,
            app_secret: apiKeys[4].app_secret,
            role_id: apiKeys[4].role_id,
            is_preset: apiKeys[4].is_preset,
          },
          {
            id: keys.data[5].id,
            name: keys.data[5].name,
            app_id: keys.data[5].app_id,
            app_secret: keys.data[5].app_secret,
            role_id: keys.data[5].role_id,
            is_preset: keys.data[5].is_preset,
          },
        ],
      });
    });

    it('with search filter', async () => {
      const keys = await apiService.listKeys(
        { search: '6' },
        { field: 'create_time', order: 'ASC' },
        { page: 1, pagesize: 20 },
      );
      expect(keys).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: keys.data[0].id,
            name: 'apiKey6',
            app_id: keys.data[0].app_id,
            app_secret: keys.data[0].app_secret,
            role_id: ROLE_TYPES.ADMIN,
            is_preset: false,
          },
        ],
      });
    });
  });

  describe('deleteKey', () => {
    it('should delete successfully', async () => {
      let currentKeys = await apiService.listKeys(
        { search: '6' },
        { field: 'create_time', order: 'ASC' },
        { page: 1, pagesize: 20 },
      );
      expect(currentKeys).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: currentKeys.data[0].id,
            name: 'apiKey6',
            app_id: currentKeys.data[0].app_id,
            app_secret: currentKeys.data[0].app_secret,
            role_id: ROLE_TYPES.ADMIN,
            is_preset: false,
          },
        ],
      });

      await apiService.deleteKey(currentKeys.data[0].id);
      deletedKeyId = currentKeys.data[0].id;

      currentKeys = await apiService.listKeys(
        { search: '6' },
        { field: 'create_time', order: 'ASC' },
        { page: 1, pagesize: 20 },
      );
      expect(currentKeys).toMatchObject({
        total: 0,
        offset: 0,
        data: [],
      });
    });

    it('should fail if not found', async () => {
      await expect(apiService.deleteKey(deletedKeyId)).rejects.toThrowError(EntityNotFoundError);
    });

    it('should fail if key is preset', async () => {
      await expect(apiService.deleteKey(apiKeys[3].id)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Preset apikey can not be deleted' }),
      );
    });
  });

  describe('verifyApiKey', () => {
    it('should verify successfully', async () => {
      const apiKey = await ApiService.verifyApiKey(
        {
          app_id: apiKeys[3].app_id,
          nonce_str: 'hello',
          sign: cryptSign({ app_id: apiKeys[3].app_id, nonce_str: 'hello' }, apiKeys[3].app_secret),
        },
        {},
      );
      expect(apiKey).toMatchObject(apiKeys[3]);
    });

    it('should return null if verification fails', async () => {
      const nullKey1 = await ApiService.verifyApiKey(undefined, {});
      expect(nullKey1).toEqual(null);

      const nullKey2 = await ApiService.verifyApiKey({ app_id: notFoundId, nonce_str: 'hello', sign: '' }, {});
      expect(nullKey2).toEqual(null);

      const nullKey3 = await ApiService.verifyApiKey({ app_id: apiKeys[3].app_id, nonce_str: 'hello', sign: '' }, {});
      expect(nullKey3).toEqual(null);
    });
  });
});
