import { connectionHook } from './jest.util';
import { HttpParams, QueryRequest } from '~/api_models/query';
import * as validation from '~/middleware/validation';
import { app } from '~/server';
import request from 'supertest';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';

describe('QueryController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;
  const server = request(app);

  const validate = jest.spyOn(validation, 'validate');

  beforeAll(async () => {
    const query: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };
    validate.mockReturnValueOnce(query);

    const response = await server.post('/account/login').send(query);

    superadminLogin = response.body;
  });

  beforeEach(() => {
    validate.mockReset();
  });

  describe('query', () => {
    it('should query pg successfully', async () => {
      const query: QueryRequest = {
        type: 'postgresql',
        key: 'preset',
        query: 'SELECT * FROM role ORDER BY id ASC',
      };
      validate.mockReturnValueOnce(query);

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject([
        {
          id: 10,
          name: 'INACTIVE',
          description: 'Disabled user. Can not login',
        },
        {
          id: 20,
          name: 'READER',
          description: 'Can view dashboards',
        },
        {
          id: 30,
          name: 'AUTHOR',
          description: 'Can view and create dashboards',
        },
        {
          id: 40,
          name: 'ADMIN',
          description:
            'Can view and create dashboards. Can add and delete datasources. Can add users except other admins',
        },
        {
          id: 50,
          name: 'SUPERADMIN',
          description: 'Can do everything',
        },
      ]);
    });

    it('should query http successfully with GET', async () => {
      const httpParams: HttpParams = {
        method: 'GET',
        data: {},
        headers: { 'Content-Type': 'application/json' },
        url_postfix: '/posts/1',
      };
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify(httpParams),
      };
      validate.mockReturnValueOnce(query);
      validate.mockReturnValueOnce(httpParams);

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
        method: 'POST',
        data: { title: 'foo', body: 'bar', userId: 1 },
        headers: { 'Content-Type': 'application/json' },
        url_postfix: '/posts',
      };
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify(httpParams),
      };
      validate.mockReturnValueOnce(query);
      validate.mockReturnValueOnce(httpParams);

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 101 });
    });

    it('should query http successfully with PUT', async () => {
      const httpParams: HttpParams = {
        method: 'PUT',
        data: { id: 1, title: 'foo', body: 'bar', userId: 1 },
        headers: { 'Content-Type': 'application/json' },
        url_postfix: '/posts/1',
      };
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify(httpParams),
      };
      validate.mockReturnValueOnce(query);
      validate.mockReturnValueOnce(httpParams);

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 1 });
    });

    it('should query http successfully with DELETE', async () => {
      const httpParams: HttpParams = {
        method: 'DELETE',
        data: {},
        headers: { 'Content-Type': 'application/json' },
        url_postfix: '/posts/1',
      };
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify(httpParams),
      };
      validate.mockReturnValueOnce(query);
      validate.mockReturnValueOnce(httpParams);

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject({});
    });
  });
});
