import { connectionHook } from './jest.util';
import { ApiService } from '../../src/services/api.service';
import { ROLE_TYPES } from '~/api_models/role';
import ApiKey from '~/models/apiKey';
import crypto from 'crypto';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { cryptSign } from '~/utils/helpers';

describe('ApiService', () => {
  connectionHook();
  let apiService: ApiService;
  let presetKey: ApiKey;
  let deletedKeyId: string;

  beforeAll(async () => {
    apiService = new ApiService();

    const apiKey = new ApiKey();
    apiKey.name = 'preset';
    apiKey.role_id = ROLE_TYPES.ADMIN;
    apiKey.app_id = crypto.randomBytes(8).toString('hex');
    apiKey.app_secret = crypto.randomBytes(16).toString('hex');
    apiKey.is_preset = true;
    presetKey = await dashboardDataSource.getRepository(ApiKey).save(apiKey);
  });

  describe('createKey', () => {
    it('should create successfully', async () => {
      await apiService.createKey('key1', ROLE_TYPES.AUTHOR);
      await apiService.createKey('key2', ROLE_TYPES.ADMIN);
    });
    
    it('should fail', async () => {
      await expect(apiService.createKey('key1', ROLE_TYPES.AUTHOR)).rejects.toThrowError(QueryFailedError);
    });
  });

  describe('listKeys', () => {
    it('no filters', async () => {
      const keys = await apiService.listKeys(undefined, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20});
      expect(keys).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: keys.data[0].id,
            name: 'preset',
            app_id: keys.data[0].app_id,
            app_secret: keys.data[0].app_secret,
            role_id: 40,
            is_preset: true
          },
          {
            id: keys.data[1].id,
            name: 'key1',
            app_id: keys.data[1].app_id,
            app_secret: keys.data[1].app_secret,
            role_id: 30,
            is_preset: false
          },
          {
            id: keys.data[2].id,
            name: 'key2',
            app_id: keys.data[2].app_id,
            app_secret: keys.data[2].app_secret,
            role_id: 40,
            is_preset: false
          }
        ]
      });
    });

    it('with search filter', async () => {
      const keys = await apiService.listKeys({ search: 'preset' }, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20});
      expect(keys).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: keys.data[0].id,
            name: 'preset',
            app_id: keys.data[0].app_id,
            app_secret: keys.data[0].app_secret,
            role_id: 40,
            is_preset: true
          }
        ]
      });
    });
  });

  describe('deleteKey', () => {
    it('should delete successfully', async () => {
      let currentKeys = await apiService.listKeys(undefined, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20});
      expect(currentKeys).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: currentKeys.data[0].id,
            name: 'preset',
            app_id: currentKeys.data[0].app_id,
            app_secret: currentKeys.data[0].app_secret,
            role_id: 40,
            is_preset: true
          },
          {
            id: currentKeys.data[1].id,
            name: 'key1',
            app_id: currentKeys.data[1].app_id,
            app_secret: currentKeys.data[1].app_secret,
            role_id: 30,
            is_preset: false
          },
          {
            id: currentKeys.data[2].id,
            name: 'key2',
            app_id: currentKeys.data[2].app_id,
            app_secret: currentKeys.data[2].app_secret,
            role_id: 40,
            is_preset: false
          }
        ]
      });

      await apiService.deleteKey(currentKeys.data[2].id);
      deletedKeyId = currentKeys.data[2].id;

      currentKeys = await apiService.listKeys(undefined, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20});
      expect(currentKeys).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: currentKeys.data[0].id,
            name: 'preset',
            app_id: currentKeys.data[0].app_id,
            app_secret: currentKeys.data[0].app_secret,
            role_id: 40,
            is_preset: true
          },
          {
            id: currentKeys.data[1].id,
            name: 'key1',
            app_id: currentKeys.data[1].app_id,
            app_secret: currentKeys.data[1].app_secret,
            role_id: 30,
            is_preset: false
          }
        ]
      });
    });

    it('should fail if not found', async () => {
      await expect(apiService.deleteKey(deletedKeyId)).rejects.toThrowError(EntityNotFoundError);
    });

    it('should fail if key is preset', async () => {
      await expect(apiService.deleteKey(presetKey.id)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Preset apikey can not be deleted' }));
    });
  });

  describe('verifyApiKey', () => {
    it('should verify successfully', async () => {
      const apiKey = await ApiService.verifyApiKey({ app_id: presetKey.app_id, nonce_str: 'hello', sign: cryptSign({ app_id: presetKey.app_id, nonce_str: 'hello' }, presetKey.app_secret) }, {});
      expect(apiKey).toMatchObject(presetKey);
    });

    it('should return null if verification fails', async() => {
      const nullKey1 = await ApiService.verifyApiKey(undefined, {});
      expect(nullKey1).toEqual(null);

      const nullKey2 = await ApiService.verifyApiKey({ app_id: '3e7acce4-b8cd-4c01-b009-d2ea33a07258', nonce_str: 'hello', sign: '' }, {});
      expect(nullKey2).toEqual(null);

      const nullKey3 = await ApiService.verifyApiKey({ app_id: presetKey.app_id, nonce_str: 'hello', sign: '' }, {});
      expect(nullKey3).toEqual(null);
    });
  });
});