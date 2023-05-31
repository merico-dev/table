import { connectionHook } from './jest.util';
import { HttpParams, QueryRequest } from '~/api_models/query';
import { app } from '~/server';
import request from 'supertest';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { FIXED_ROLE_PERMISSIONS, FIXED_ROLE_TYPES } from '~/services/role.service';

describe('QueryController', () => {
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
  });

  describe('query', () => {
    it('should query pg successfully', async () => {
      const query: QueryRequest = {
        type: 'postgresql',
        key: 'preset',
        query: 'SELECT * FROM role ORDER BY id ASC',
      };

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject([
        {
          id: FIXED_ROLE_TYPES.ADMIN,
          description:
            'Can view and create dashboards. Can add and delete datasources. Can add users except other admins',
          permissions: FIXED_ROLE_PERMISSIONS.ADMIN,
        },
        {
          id: FIXED_ROLE_TYPES.AUTHOR,
          description: 'Can view and create dashboards',
          permissions: FIXED_ROLE_PERMISSIONS.AUTHOR,
        },
        {
          id: FIXED_ROLE_TYPES.INACTIVE,
          description: 'Disabled user. Can not login',
          permissions: [],
        },
        {
          id: FIXED_ROLE_TYPES.READER,
          description: 'Can view dashboards',
          permissions: FIXED_ROLE_PERMISSIONS.READER,
        },
        {
          id: FIXED_ROLE_TYPES.SUPERADMIN,
          description: 'Can do everything',
          permissions: FIXED_ROLE_PERMISSIONS.SUPERADMIN,
        },
      ]);
    });

    it('should query http successfully with GET', async () => {
      const httpParams: HttpParams = {
        host: '',
        method: 'GET',
        data: {},
        params: {},
        headers: { 'Content-Type': 'application/json' },
        url: '/posts/1',
      };
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify(httpParams),
      };

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject({
        userId: 1,
        id: 1,
        title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit\n' +
          'suscipit recusandae consequuntur expedita et cum\n' +
          'reprehenderit molestiae ut ut quas totam\n' +
          'nostrum rerum est autem sunt rem eveniet architecto',
      });
    });

    it('should query http successfully with POST', async () => {
      const httpParams: HttpParams = {
        host: '',
        method: 'POST',
        data: { title: 'foo', body: 'bar', userId: 1 },
        params: {},
        headers: { 'Content-Type': 'application/json' },
        url: '/posts',
      };
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify(httpParams),
      };

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 101 });
    });

    it('should query http successfully with PUT', async () => {
      const httpParams: HttpParams = {
        host: '',
        method: 'PUT',
        data: { id: 1, title: 'foo', body: 'bar', userId: 1 },
        params: {},
        headers: { 'Content-Type': 'application/json' },
        url: '/posts/1',
      };
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify(httpParams),
      };

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 1 });
    });

    it('should query http successfully with DELETE', async () => {
      const httpParams: HttpParams = {
        host: '',
        method: 'DELETE',
        data: {},
        params: {},
        headers: { 'Content-Type': 'application/json' },
        url: '/posts/1',
      };
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify(httpParams),
      };

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject({});
    });
  });
});
