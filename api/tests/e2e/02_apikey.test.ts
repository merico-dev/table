import { connectionHook, createAuthStruct } from './jest.util';
import { ROLE_TYPES } from '~/api_models/role';
import ApiKey from '~/models/apiKey';
import crypto from 'crypto';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { app } from '~/server';
import request from 'supertest';
import * as validation from '~/middleware/validation';
import { ApiKeyCreateRequest, ApiKeyIDRequest, ApiKeyListRequest } from '~/api_models/api';
import { has } from 'lodash';

describe('APIController', () => {
  connectionHook();
  let presetKey: ApiKey;
  let deletedKeyId: string;
  const server = request(app);

  const validate = jest.spyOn(validation, 'validate');

  beforeAll(async () => {
    const apiKey = new ApiKey();
    apiKey.name = 'preset';
    apiKey.role_id = ROLE_TYPES.SUPERADMIN;
    apiKey.app_id = crypto.randomBytes(8).toString('hex');
    apiKey.app_secret = crypto.randomBytes(16).toString('hex');
    apiKey.is_preset = true;
    presetKey = await dashboardDataSource.getRepository(ApiKey).save(apiKey);
  });

  beforeEach(() => {
    validate.mockReset();
  });

  describe('createKey', () => {
    it('should create successfully', async () => {
      const authentication1 = createAuthStruct(presetKey, { name: 'key1', role_id: ROLE_TYPES.AUTHOR });
      validate.mockReturnValueOnce(authentication1);

      const createRequest1: ApiKeyCreateRequest = {
        name: 'key1',
        role_id: ROLE_TYPES.AUTHOR,
        authentication: authentication1
      };
      validate.mockReturnValueOnce(createRequest1);

      const response1 = await server
        .post('/api/key/create')
        .send(createRequest1);
      
      expect(has(response1.body, 'app_id')).toBe(true);
      expect(has(response1.body, 'app_secret')).toBe(true);

      const authentication2 = createAuthStruct(presetKey, { name: 'key2', role_id: ROLE_TYPES.ADMIN });
      validate.mockReturnValueOnce(authentication2);

      const createRequest2: ApiKeyCreateRequest = {
        name: 'key2',
        role_id: ROLE_TYPES.ADMIN,
        authentication: authentication2
      };
      validate.mockReturnValueOnce(createRequest2);

      const response2 = await server
        .post('/api/key/create')
        .send(createRequest2);

      expect(has(response2.body, 'app_id')).toBe(true);
      expect(has(response2.body, 'app_secret')).toBe(true);
    });
    
    it('should fail with duplicate key', async () => {
      const authentication = createAuthStruct(presetKey, { name: 'key1', role_id: ROLE_TYPES.AUTHOR });
      validate.mockReturnValueOnce(authentication);

      const createRequest: ApiKeyCreateRequest = {
        name: 'key1',
        role_id: ROLE_TYPES.AUTHOR,
        authentication
      };
      validate.mockReturnValueOnce(createRequest);

      const response = await server
        .post('/api/key/create')
        .send(createRequest);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: {
          message: 'duplicate key value violates unique constraint "api_key_name_preset_idx"'
        }
      });
    });
  });

  describe('listKeys', () => {
    it('no filters', async () => {
      const authentication = createAuthStruct(presetKey, {
        pagination: { page: 1, pagesize: 20 },
        sort: { field: 'name', order: 'ASC' }
      });
      validate.mockReturnValueOnce(authentication);

      const query: ApiKeyListRequest = {
        pagination: { page: 1, pagesize: 20 },
        sort: { field: 'name', order: 'ASC' },
        authentication
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/api/key/list')
        .send(query);
      
      expect(response.body).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            name: 'key1',
            app_id: response.body.data[0].app_id,
            app_secret: response.body.data[0].app_secret,
            role_id: ROLE_TYPES.AUTHOR,
            is_preset: false
          },
          {
            id: response.body.data[1].id,
            name: 'key2',
            app_id: response.body.data[1].app_id,
            app_secret: response.body.data[1].app_secret,
            role_id: ROLE_TYPES.ADMIN,
            is_preset: false
          },
          {
            id: presetKey.id,
            name: 'preset',
            app_id: presetKey.app_id,
            app_secret: presetKey.app_secret,
            role_id: ROLE_TYPES.SUPERADMIN,
            is_preset: true
          }
        ]
      });
      deletedKeyId = response.body.data[1].id;
    });

    it('with search filter', async () => {
      const authentication = createAuthStruct(presetKey, {
        filter: { search: 'preset' },
        pagination: { page: 1, pagesize: 20 },
        sort: { field: 'name', order: 'ASC' }
      });
      validate.mockReturnValueOnce(authentication);

      const query: ApiKeyListRequest = {
        filter: { search: 'preset' },
        pagination: { page: 1, pagesize: 20 },
        sort: { field: 'name', order: 'ASC' },
        authentication
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/api/key/list')
        .send(query);

      expect(response.body).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: presetKey.id,
            name: 'preset',
            app_id: presetKey.app_id,
            app_secret: presetKey.app_secret,
            role_id: ROLE_TYPES.SUPERADMIN,
            is_preset: true
          }
        ]
      });
    });
  });

  describe('deleteKey', () => {
    it('should delete successfully', async () => {
      const authentication1 = createAuthStruct(presetKey, { id: deletedKeyId });
      validate.mockReturnValueOnce(authentication1);

      const deleteQuery: ApiKeyIDRequest = {
        id: deletedKeyId,
        authentication: authentication1
      };
      validate.mockReturnValueOnce(deleteQuery);

      const deleteResponse = await server
        .post('/api/key/delete')
        .send(deleteQuery);
      
      expect(deleteResponse.body).toMatchObject({
        id: deletedKeyId
      });

      const authentication2 = createAuthStruct(presetKey, {
        pagination: { page: 1, pagesize: 20 },
        sort: { field: 'name', order: 'ASC' }
      });
      validate.mockReturnValueOnce(authentication2);

      const listQuery: ApiKeyListRequest = {
        pagination: { page: 1, pagesize: 20 },
        sort: { field: 'name', order: 'ASC' },
        authentication: authentication2
      };
      validate.mockReturnValueOnce(listQuery);

      const listResponse = await server
        .post('/api/key/list')
        .send(listQuery);

      expect(listResponse.body).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: listResponse.body.data[0].id,
            name: 'key1',
            app_id: listResponse.body.data[0].app_id,
            app_secret: listResponse.body.data[0].app_secret,
            role_id: ROLE_TYPES.AUTHOR,
            is_preset: false
          },
          {
            id: presetKey.id,
            name: 'preset',
            app_id: presetKey.app_id,
            app_secret: presetKey.app_secret,
            role_id: ROLE_TYPES.SUPERADMIN,
            is_preset: true
          }
        ]
      });
    });

    it('should fail if not found', async () => {
      const authentication = createAuthStruct(presetKey, { id: deletedKeyId });
      validate.mockReturnValueOnce(authentication);

      const query: ApiKeyIDRequest = {
        id: deletedKeyId,
        authentication
      }
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/api/key/delete')
        .send(query);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "ApiKey" matching');
      expect(response.body.detail.message).toContain(deletedKeyId);
    });

    it('should fail if key is preset', async () => {
      const authentication = createAuthStruct(presetKey, { id: presetKey.id });
      validate.mockReturnValueOnce(authentication);

      const query: ApiKeyIDRequest = {
        id: presetKey.id,
        authentication
      }
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/api/key/delete')
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Preset apikey can not be deleted' }
      });
    });
  });
});