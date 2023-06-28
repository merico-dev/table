import { connectionHook } from './jest.util';
import { app } from '~/server';
import request from 'supertest';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { omitFields } from '~/utils/helpers';
import SqlSnippet from '~/models/sql_snippet';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { SqlSnippetCreateOrUpdateRequest, SqlSnippetIDRequest, SqlSnippetListRequest } from '~/api_models/sql_snippet';
import { notFoundId } from './constants';

describe('SqlSnippetController', () => {
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

    const presetSqlSnippet = new SqlSnippet();
    presetSqlSnippet.id = 'presetSqlSnippet';
    presetSqlSnippet.content = 'presetSqlSnippet';
    presetSqlSnippet.is_preset = true;
    await dashboardDataSource.getRepository(SqlSnippet).save(presetSqlSnippet);
  });

  describe('createOrUpdate', () => {
    it('should create successfully', async () => {
      const request1: SqlSnippetCreateOrUpdateRequest = {
        id: 'sqlSnippet1',
        content: 'sqlSnippet1',
      };

      const response1 = await server
        .post('/sql_snippet/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request1);

      response1.body = omitFields(response1.body, ['create_time', 'update_time']);
      expect(response1.body).toMatchObject({
        id: 'sqlSnippet1',
        content: 'sqlSnippet1',
        is_preset: false,
      });

      const request2: SqlSnippetCreateOrUpdateRequest = {
        id: 'sqlSnippet2',
        content: 'sqlSnippet2',
      };

      const response2 = await server
        .post('/sql_snippet/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request2);

      expect(omitFields(response2.body, ['create_time', 'update_time'])).toMatchObject({
        id: 'sqlSnippet2',
        content: 'sqlSnippet2',
        is_preset: false,
      });
    });

    it('should fail if duplicate', async () => {
      const request: SqlSnippetCreateOrUpdateRequest = {
        id: 'sqlSnippet1',
        content: 'sqlSnippet1',
      };

      const response = await server
        .post('/sql_snippet/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'A sql snippet with that id already exists' },
      });
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const request: SqlSnippetCreateOrUpdateRequest = {
        id: 'sqlSnippet1',
        content: 'sqlSnippet1_updated',
      };

      const response = await server
        .put('/sql_snippet/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(omitFields(response.body, ['create_time', 'update_time'])).toMatchObject({
        id: 'sqlSnippet1',
        content: 'sqlSnippet1_updated',
        is_preset: false,
      });
    });

    it('should fail if preset', async () => {
      const request: SqlSnippetCreateOrUpdateRequest = {
        id: 'presetSqlSnippet',
        content: 'presetSqlSnippet_updated',
      };

      const response = await server
        .put('/sql_snippet/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Preset sql snippets can not be edited' },
      });
    });

    it('should fail if not found', async () => {
      const request: SqlSnippetCreateOrUpdateRequest = {
        id: notFoundId,
        content: '',
      };

      const response = await server
        .put('/sql_snippet/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "SqlSnippet" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const request: SqlSnippetListRequest = {
        sort: [{ field: 'id', order: 'ASC' }],
        pagination: { page: 1, pagesize: 20 },
      };

      const response = await server
        .post('/sql_snippet/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      response.body.data = response.body.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(response.body).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: 'presetSqlSnippet',
            content: 'presetSqlSnippet',
            is_preset: true,
          },
          {
            id: 'sqlSnippet1',
            content: 'sqlSnippet1_updated',
            is_preset: false,
          },
          {
            id: 'sqlSnippet2',
            content: 'sqlSnippet2',
            is_preset: false,
          },
        ],
      });
    });

    it('with filters', async () => {
      const request: SqlSnippetListRequest = {
        filter: { id: { isFuzzy: true, value: 'preset' } },
        sort: [{ field: 'id', order: 'ASC' }],
        pagination: { page: 1, pagesize: 20 },
      };

      const response = await server
        .post('/sql_snippet/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      response.body.data = response.body.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(response.body).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: 'presetSqlSnippet',
            content: 'presetSqlSnippet',
            is_preset: true,
          },
        ],
      });
    });
  });

  describe('get', () => {
    it('should return successfully', async () => {
      const request: SqlSnippetIDRequest = {
        id: 'sqlSnippet1',
      };

      const response = await server
        .post('/sql_snippet/get')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(omitFields(response.body, ['create_time', 'update_time'])).toMatchObject({
        id: 'sqlSnippet1',
        content: 'sqlSnippet1_updated',
        is_preset: false,
      });
    });

    it('should fail if not found', async () => {
      const request: SqlSnippetIDRequest = {
        id: notFoundId,
      };

      const response = await server
        .post('/sql_snippet/get')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "SqlSnippet" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      const request: SqlSnippetIDRequest = {
        id: 'sqlSnippet1',
      };

      const response = await server
        .post('/sql_snippet/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({ id: 'sqlSnippet1' });
    });

    it('should fail if preset', async () => {
      const request: SqlSnippetIDRequest = {
        id: 'presetSqlSnippet',
      };

      const response = await server
        .post('/sql_snippet/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Preset sql snippets can not be deleted' },
      });
    });

    it('should fail if not found', async () => {
      const request: SqlSnippetIDRequest = {
        id: notFoundId,
      };

      const response = await server
        .post('/sql_snippet/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "SqlSnippet" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });
  });
});
