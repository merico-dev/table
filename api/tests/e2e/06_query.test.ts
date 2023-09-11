import { connectionHook } from './jest.util';
import { QueryRequest } from '~/api_models/query';
import { app } from '~/server';
import request from 'supertest';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { DashboardCreateRequest } from '~/api_models/dashboard';
import { DashboardContentCreateRequest } from '~/api_models/dashboard_content';
import { dashboardDataSource } from '~/data_sources/dashboard';
import Dashboard from '~/models/dashboard';

describe('QueryController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;
  let dashboardId: string;
  let dashboardContentId: string;
  const server = request(app);

  beforeAll(async () => {
    const query: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };

    const response = await server.post('/account/login').send(query);

    superadminLogin = response.body;
    const queryDashboardRequest: DashboardCreateRequest = {
      name: 'queryDashboard',
      group: '',
    };

    const queryDashboardResponse = await server
      .post('/dashboard/create')
      .set('Authorization', `Bearer ${superadminLogin.token}`)
      .send(queryDashboardRequest);

    dashboardId = queryDashboardResponse.body.id;

    const queryDashboardContentRequest: DashboardContentCreateRequest = {
      dashboard_id: dashboardId,
      name: 'queryDashboardContent',
      content: {
        definition: {
          queries: [
            {
              id: 'pgQuery',
              type: 'postgresql',
              key: 'preset',
              sql: 'SELECT ${sql_snippets.role_columns} FROM role WHERE id = ${filters.role_id} AND ${context.true}',
            },
            {
              id: 'httpGetQuery',
              type: 'http',
              key: 'jsonplaceholder_renamed',
              sql: '',
              pre_process:
                'function build_request({ context, filters }, utils) {\n const data = {};\n const headers = { "Content-Type": "application/json" };\n\n  return {\n    method: "GET",\n    url: "/posts/1",\n    params: {},\n    headers,\n    data,\n  };\n}\n',
            },
            {
              id: 'httpPostQuery',
              type: 'http',
              key: 'jsonplaceholder_renamed',
              sql: '',
              pre_process:
                'function build_request({ context, filters }, utils) {\n const data = { "title": "foo", "body": "bar", "userId": 1 };\n const headers = { "Content-Type": "application/json" };\n\n  return {\n    method: "POST",\n    url: "/posts",\n    params: {},\n    headers,\n    data,\n  };\n}\n',
            },
            {
              id: 'httpPutQuery',
              type: 'http',
              key: 'jsonplaceholder_renamed',
              sql: '',
              pre_process:
                'function build_request({ context, filters }, utils) {\n const data = { "id": 1, "title": "foo", "body": "bar", "userId": 1 };\n const headers = { "Content-Type": "application/json" };\n\n  return {\n    method: "PUT",\n    url: "/posts/1",\n    params: {},\n    headers,\n    data,\n  };\n}\n',
            },
            {
              id: 'httpDeleteQuery',
              type: 'http',
              key: 'jsonplaceholder_renamed',
              sql: '',
              pre_process:
                'function build_request({ context, filters }, utils) {\n const data = {};\n const headers = { "Content-Type": "application/json" };\n\n  return {\n    method: "DELETE",\n    url: "/posts/1",\n    params: {},\n    headers,\n    data,\n  };\n}\n',
            },
          ],
          sqlSnippets: [
            {
              key: 'role_columns',
              value: 'id, description',
            },
          ],
        },
      },
    };

    const queryDashboardContentReponse = await server
      .post('/dashboard_content/create')
      .set('Authorization', `Bearer ${superadminLogin.token}`)
      .send(queryDashboardContentRequest);

    dashboardContentId = queryDashboardContentReponse.body.id;
  });

  afterAll(async () => {
    if (!dashboardDataSource.isInitialized) {
      await dashboardDataSource.initialize();
    }
    await dashboardDataSource.getRepository(Dashboard).delete(dashboardId);
    await dashboardDataSource.destroy();
  });

  describe('query', () => {
    it('should query pg successfully', async () => {
      const query: QueryRequest = {
        type: 'postgresql',
        key: 'preset',
        query: "SELECT id, description FROM role WHERE id = 'SUPERADMIN' AND true",
        content_id: dashboardContentId,
        query_id: 'pgQuery',
        params: { filters: { role_id: "'SUPERADMIN'" }, context: { true: 'true' } },
      };

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject([{ id: 'SUPERADMIN', description: 'Can do everything' }]);
    });

    it('should query http successfully with GET', async () => {
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify({
          host: '',
          method: 'GET',
          data: {},
          params: {},
          headers: { 'Content-Type': 'application/json' },
          url: '/posts/1',
        }),
        content_id: dashboardContentId,
        query_id: 'httpGetQuery',
        params: { filters: {}, context: {} },
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
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify({
          host: '',
          method: 'POST',
          data: { title: 'foo', body: 'bar', userId: 1 },
          params: {},
          headers: { 'Content-Type': 'application/json' },
          url: '/posts',
        }),
        content_id: dashboardContentId,
        query_id: 'httpPostQuery',
        params: { filters: {}, context: {} },
      };

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 101 });
    });

    it('should query http successfully with PUT', async () => {
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify({
          host: '',
          method: 'PUT',
          data: { id: 1, title: 'foo', body: 'bar', userId: 1 },
          params: {},
          headers: { 'Content-Type': 'application/json' },
          url: '/posts/1',
        }),
        content_id: dashboardContentId,
        query_id: 'httpPutQuery',
        params: { filters: {}, context: {} },
      };

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 1 });
    });

    it('should query http successfully with DELETE', async () => {
      const query: QueryRequest = {
        type: 'http',
        key: 'jsonplaceholder_renamed',
        query: JSON.stringify({
          host: '',
          method: 'DELETE',
          data: {},
          params: {},
          headers: { 'Content-Type': 'application/json' },
          url: '/posts/1',
        }),
        content_id: dashboardContentId,
        query_id: 'httpDeleteQuery',
        params: { filters: {}, context: {} },
      };

      const response = await server.post('/query').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      expect(response.body).toMatchObject({});
    });
  });
});
