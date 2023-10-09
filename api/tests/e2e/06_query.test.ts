import { connectionHook } from './jest.util';
import { QueryRequest, QueryStructureRequest } from '~/api_models/query';
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
        version: '',
        definition: {
          queries: [
            {
              id: 'pgQuery',
              type: 'postgresql',
              key: 'preset',
              sql: 'SELECT ${sql_snippets.role_columns} FROM role WHERE id = ${filters.role_id} AND ${context.true}',
              pre_process: '',
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

  describe('queryStructure', () => {
    it('query_type = TABLES', async () => {
      const query: QueryStructureRequest = {
        query_type: 'TABLES',
        type: 'postgresql',
        key: 'preset',
        table_schema: '',
        table_name: '',
      };

      const response = await server
        .post('/query/structure')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body.length).toEqual(222);
      expect(response.body[212]).toMatchObject({
        table_schema: 'public',
        table_name: 'dashboard',
        table_type: 'BASE TABLE',
      });
    });

    it('query_type = COLUMNS', async () => {
      const query: QueryStructureRequest = {
        query_type: 'COLUMNS',
        type: 'postgresql',
        key: 'preset',
        table_schema: 'public',
        table_name: 'dashboard',
      };

      const response = await server
        .post('/query/structure')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject([
        {
          ordinal_position: 1,
          column_key: 'P',
          column_key_text: 'PRIMARY KEY (id)',
          column_name: 'id',
          column_type: 'uuid',
          is_nullable: 'NO',
          column_default: 'gen_random_uuid()',
          column_comment: null,
        },
        {
          ordinal_position: 2,
          column_key: null,
          column_key_text: null,
          column_name: 'name',
          column_type: 'character varying',
          is_nullable: 'NO',
          column_default: null,
          column_comment: null,
        },
        {
          ordinal_position: 4,
          column_key: null,
          column_key_text: null,
          column_name: 'create_time',
          column_type: 'timestamp with time zone',
          is_nullable: 'NO',
          column_default: 'CURRENT_TIMESTAMP',
          column_comment: null,
        },
        {
          ordinal_position: 5,
          column_key: null,
          column_key_text: null,
          column_name: 'update_time',
          column_type: 'timestamp with time zone',
          is_nullable: 'NO',
          column_default: 'CURRENT_TIMESTAMP',
          column_comment: null,
        },
        {
          ordinal_position: 6,
          column_key: null,
          column_key_text: null,
          column_name: 'is_removed',
          column_type: 'boolean',
          is_nullable: 'NO',
          column_default: 'false',
          column_comment: null,
        },
        {
          ordinal_position: 7,
          column_key: null,
          column_key_text: null,
          column_name: 'is_preset',
          column_type: 'boolean',
          is_nullable: 'NO',
          column_default: 'false',
          column_comment: null,
        },
        {
          ordinal_position: 8,
          column_key: null,
          column_key_text: null,
          column_name: 'group',
          column_type: 'character varying',
          is_nullable: 'NO',
          column_default: "''::character varying",
          column_comment: null,
        },
        {
          ordinal_position: 9,
          column_key: 'F',
          column_key_text: 'FOREIGN KEY (content_id) REFERENCES dashboard_content(id) ON DELETE SET NULL',
          column_name: 'content_id',
          column_type: 'uuid',
          is_nullable: 'YES',
          column_default: null,
          column_comment: null,
        },
      ]);
    });

    it('query_type = DATA', async () => {
      const query: QueryStructureRequest = {
        query_type: 'DATA',
        type: 'postgresql',
        key: 'preset',
        table_schema: 'public',
        table_name: 'dashboard',
      };

      const response = await server
        .post('/query/structure')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body.length).toEqual(4);
    });

    it('query_type = COUNT', async () => {
      const query: QueryStructureRequest = {
        query_type: 'COUNT',
        type: 'postgresql',
        key: 'preset',
        table_schema: 'public',
        table_name: 'dashboard',
      };

      const response = await server
        .post('/query/structure')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject([{ total: '4' }]);
    });

    it('query_type = INDEXES', async () => {
      const query: QueryStructureRequest = {
        query_type: 'INDEXES',
        type: 'postgresql',
        key: 'preset',
        table_schema: 'public',
        table_name: 'dashboard',
      };

      const response = await server
        .post('/query/structure')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject([
        {
          index_name: 'dashboard_pkey',
          index_algorithm: 'BTREE',
          is_unique: true,
          index_definition: 'CREATE UNIQUE INDEX dashboard_pkey ON public.dashboard USING btree (id)',
          condition: '',
          comment: null,
        },
        {
          index_name: 'dashboard_name_preset_idx',
          index_algorithm: 'BTREE',
          is_unique: true,
          index_definition:
            'CREATE UNIQUE INDEX dashboard_name_preset_idx ON public.dashboard USING btree (name, is_preset) WHERE (is_removed = false)',
          condition: '(is_removed = false)',
          comment: null,
        },
      ]);
    });
  });
});
