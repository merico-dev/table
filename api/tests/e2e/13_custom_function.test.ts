import { connectionHook } from './jest.util';
import { app } from '~/server';
import request from 'supertest';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { omitTime } from '~/utils/helpers';
import CustomFunction from '~/models/custom_function';
import { dashboardDataSource } from '~/data_sources/dashboard';
import {
  CustomFunctionCreateOrUpdateRequest,
  CustomFunctionIDRequest,
  CustomFunctionListRequest,
} from '~/api_models/custom_function';
import { notFoundId } from './constants';

describe('CustomFunctionController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;

  const server = request(app);

  beforeAll(async () => {
    const query: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };

    const response = await server.post('/account/login').send(query);
    superadminLogin = response.body;

    const presetCustomFunction = new CustomFunction();
    presetCustomFunction.id = 'presetCustomFunction';
    presetCustomFunction.definition = '() => console.log("hello world")';
    presetCustomFunction.is_preset = true;
    await dashboardDataSource.getRepository(CustomFunction).save(presetCustomFunction);
  });

  describe('create', () => {
    it('should create successfully', async () => {
      const request1: CustomFunctionCreateOrUpdateRequest = {
        id: 'customFunction1',
        definition: '() => console.log("hello world 1")',
      };

      const response1 = await server
        .post('/custom_function/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request1);

      response1.body = omitTime(response1.body);
      expect(response1.body).toMatchObject({
        id: 'customFunction1',
        definition: '() => console.log("hello world 1")',
        is_preset: false,
      });

      const request2: CustomFunctionCreateOrUpdateRequest = {
        id: 'customFunction2',
        definition: '() => console.log("hello world 2")',
      };

      const response2 = await server
        .post('/custom_function/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request2);

      expect(omitTime(response2.body)).toMatchObject({
        id: 'customFunction2',
        definition: '() => console.log("hello world 2")',
        is_preset: false,
      });
    });

    it('should fail if duplicate', async () => {
      const request: CustomFunctionCreateOrUpdateRequest = {
        id: 'customFunction1',
        definition: '() => console.log("hello world 1")',
      };

      const response = await server
        .post('/custom_function/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'A custom function with that id already exists' },
      });
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const request: CustomFunctionCreateOrUpdateRequest = {
        id: 'customFunction1',
        definition: '() => console.log("hello world 1 updated")',
      };

      const response = await server
        .put('/custom_function/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(omitTime(response.body)).toMatchObject({
        id: 'customFunction1',
        definition: '() => console.log("hello world 1 updated")',
        is_preset: false,
      });
    });

    it('should fail if preset', async () => {
      const request: CustomFunctionCreateOrUpdateRequest = {
        id: 'presetCustomFunction',
        definition: '() => console.log("hello world preset")',
      };

      const response = await server
        .put('/custom_function/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Preset custom functions can not be edited' },
      });
    });

    it('should fail if not found', async () => {
      const request: CustomFunctionCreateOrUpdateRequest = {
        id: notFoundId,
        definition: '',
      };

      const response = await server
        .put('/custom_function/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "CustomFunction" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const request: CustomFunctionListRequest = {
        sort: [{ field: 'id', order: 'ASC' }],
        pagination: { page: 1, pagesize: 20 },
      };

      const response = await server
        .post('/custom_function/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      response.body.data = response.body.data.map(omitTime);
      expect(response.body).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: 'customFunction1',
            definition: '() => console.log("hello world 1 updated")',
            is_preset: false,
          },
          {
            id: 'customFunction2',
            definition: '() => console.log("hello world 2")',
            is_preset: false,
          },
          {
            id: 'presetCustomFunction',
            definition: '() => console.log("hello world")',
            is_preset: true,
          },
        ],
      });
    });

    it('with filters', async () => {
      const request: CustomFunctionListRequest = {
        filter: { id: { isFuzzy: true, value: 'preset' } },
        sort: [{ field: 'id', order: 'ASC' }],
        pagination: { page: 1, pagesize: 20 },
      };

      const response = await server
        .post('/custom_function/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      response.body.data = response.body.data.map(omitTime);
      expect(response.body).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: 'presetCustomFunction',
            definition: '() => console.log("hello world")',
            is_preset: true,
          },
        ],
      });
    });
  });

  describe('get', () => {
    it('should return successfully', async () => {
      const request: CustomFunctionIDRequest = {
        id: 'customFunction1',
      };

      const response = await server
        .post('/custom_function/get')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(omitTime(response.body)).toMatchObject({
        id: 'customFunction1',
        definition: '() => console.log("hello world 1 updated")',
        is_preset: false,
      });
    });

    it('should fail if not found', async () => {
      const request: CustomFunctionIDRequest = {
        id: notFoundId,
      };

      const response = await server
        .post('/custom_function/get')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "CustomFunction" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      const request: CustomFunctionIDRequest = {
        id: 'customFunction1',
      };

      const response = await server
        .post('/custom_function/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({ id: 'customFunction1' });
    });

    it('should fail if preset', async () => {
      const request: CustomFunctionIDRequest = {
        id: 'presetCustomFunction',
      };

      const response = await server
        .post('/custom_function/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Preset custom functions can not be deleted' },
      });
    });

    it('should fail if not found', async () => {
      const request: CustomFunctionIDRequest = {
        id: notFoundId,
      };

      const response = await server
        .post('/custom_function/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "CustomFunction" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });
  });
});
