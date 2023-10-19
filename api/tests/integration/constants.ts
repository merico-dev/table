import { FIXED_ROLE_TYPES } from '~/services/role.service';
import Account from '~/models/account';
import ApiKey from '~/models/apiKey';
import DataSource from '~/models/datasource';
import Dashboard from '~/models/dashboard';
import { parseDBUrl } from '../utils';
import DashboardContent from '~/models/dashboard_content';
import CustomFunction from '~/models/custom_function';
import SqlSnippet from '~/models/sql_snippet';
import { versions } from '~/dashboard_migration';

export const accounts: Account[] = [
  {
    id: '6ea04311-b43a-4407-badf-a71ea8c20aec',
    name: 'account1',
    email: 'account1@test.com',
    password: '', //Will be filled later
    role_id: FIXED_ROLE_TYPES.INACTIVE,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'deec745c-a9af-4b6a-8322-9abbb395c0f0',
    name: 'account2',
    email: 'account2@test.com',
    password: '', //Will be filled later
    role_id: FIXED_ROLE_TYPES.READER,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'df1f74ae-f608-4c0d-a41f-54f5054f9bce',
    name: 'account3',
    email: 'account3@test.com',
    password: '', //Will be filled later
    role_id: FIXED_ROLE_TYPES.AUTHOR,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'dde24a37-1355-40a5-b82a-02cf72af1337',
    name: 'account4',
    email: 'account4@test.com',
    password: '', //Will be filled later
    role_id: FIXED_ROLE_TYPES.ADMIN,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '1b7a960b-24bf-4c5e-8043-6dbc146b1348',
    name: 'superadmin',
    email: 'superadmin@test.com',
    password: '', //Will be filled later
    role_id: FIXED_ROLE_TYPES.SUPERADMIN,
    create_time: new Date(),
    update_time: new Date(),
  },
];

export const apiKeys: ApiKey[] = [
  {
    id: '7f6996ce-0ce8-4e6f-b95f-b093ede0585f',
    name: 'apiKey1',
    is_preset: false,
    role_id: FIXED_ROLE_TYPES.INACTIVE,
    app_id: 'apiKey1_appid',
    app_secret: 'apiKey1_appsecret',
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '27d288d7-9c9a-45d7-9a93-1031f1dc0365',
    name: 'apiKey2',
    is_preset: false,
    role_id: FIXED_ROLE_TYPES.READER,
    app_id: 'apiKey2_appid',
    app_secret: 'apiKey2_appsecret',
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'd2f2ac4d-c17d-49c8-9eb5-5b98506c33da',
    name: 'apiKey3',
    is_preset: false,
    role_id: FIXED_ROLE_TYPES.AUTHOR,
    app_id: 'apiKey3_appid',
    app_secret: 'apiKey3_appsecret',
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '561b2afc-44ce-40c9-b09f-598326201310',
    name: 'apiKey4',
    is_preset: true,
    role_id: FIXED_ROLE_TYPES.ADMIN,
    app_id: 'apiKey4_appid',
    app_secret: 'apiKey4_appsecret',
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '03a8b034-af52-47c5-a1d7-e7e107ddf688',
    name: 'apiKey5',
    is_preset: false,
    role_id: FIXED_ROLE_TYPES.SUPERADMIN,
    app_id: 'apiKey5_appid',
    app_secret: 'apiKey5_appsecret',
    create_time: new Date(),
    update_time: new Date(),
  },
];

export const pgSourceConfig = parseDBUrl(process.env.INTEGRATION_TEST_PG_URL!);
export const dataSources: DataSource[] = [
  {
    id: '9411735f-239d-46df-93d3-c188d1cb0422',
    type: 'postgresql',
    key: 'pg',
    is_preset: false,
    config: {
      host: pgSourceConfig.host,
      port: pgSourceConfig.port,
      username: pgSourceConfig.username,
      password: pgSourceConfig.password,
      database: pgSourceConfig.database,
    },
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '649bfad3-dd4d-417a-b376-0fa77a15b5a7',
    type: 'http',
    key: 'jsonplaceholder',
    is_preset: true,
    config: {
      host: 'http://jsonplaceholder.typicode.com',
      processing: {
        pre: '',
        post: '',
      },
    },
    create_time: new Date(),
    update_time: new Date(),
  },
];

export const dashboards: Dashboard[] = [
  {
    id: '63c52cf7-0783-40fb-803a-68abc6564de0',
    name: 'dashboard1',
    is_preset: false,
    is_removed: true,
    content_id: null,
    group: '1',
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '173b84d2-7ed9-4d1a-a386-e68a6cce192b',
    name: 'dashboard2',
    is_preset: true,
    is_removed: false,
    content_id: null,
    group: '1',
    create_time: new Date(),
    update_time: new Date(),
  },
];

export const dashboardContents: DashboardContent[] = [
  {
    id: '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
    dashboard_id: '63c52cf7-0783-40fb-803a-68abc6564de0',
    name: 'dashboard1',
    content: {
      version: versions[versions.length - 1],
      definition: {
        queries: [
          {
            id: 'pgQuery1',
            type: 'postgresql',
            key: 'pg',
            sql: 'SELECT ${sql_snippets.role_columns} FROM role WHERE id = ${filters.role_id} AND ${context.true}',
            pre_process: '',
          },
          {
            id: 'httpGetQuery',
            type: 'http',
            key: 'jsonplaceholder',
            sql: '',
            pre_process:
              'function build_request({ context, filters }, utils) {\n const data = {};\n const headers = { "Content-Type": "application/json" };\n\n  return {\n    method: "GET",\n    url: "/posts/1",\n    params: {},\n    headers,\n    data,\n  };\n}\n',
          },
          {
            id: 'httpPostQuery',
            type: 'http',
            key: 'jsonplaceholder',
            sql: '',
            pre_process:
              'function build_request({ context, filters }, utils) {\n const data = { "title": "foo", "body": "bar", "userId": 1 };\n const headers = { "Content-Type": "application/json" };\n\n  return {\n    method: "POST",\n    url: "/posts",\n    params: {},\n    headers,\n    data,\n  };\n}\n',
          },
          {
            id: 'httpPutQuery',
            type: 'http',
            key: 'jsonplaceholder',
            sql: '',
            pre_process:
              'function build_request({ context, filters }, utils) {\n const data = { "id": 1, "title": "foo", "body": "bar", "userId": 1 };\n const headers = { "Content-Type": "application/json" };\n\n  return {\n    method: "PUT",\n    url: "/posts/1",\n    params: {},\n    headers,\n    data,\n  };\n}\n',
          },
          {
            id: 'httpDeleteQuery',
            type: 'http',
            key: 'jsonplaceholder',
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
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '5959a66b-5b6b-4509-9d87-bb8b96100658',
    dashboard_id: '173b84d2-7ed9-4d1a-a386-e68a6cce192b',
    name: 'dashboard2',
    content: {
      version: versions[versions.length - 1],
      definition: {
        queries: [
          {
            id: 'pgQuery2',
            type: 'postgresql',
            key: 'pg',
            sql: '',
            pre_process: '',
          },
          {
            id: 'httpQuery2',
            type: 'http',
            key: 'jsonplaceholder',
            sql: '',
            pre_process: '',
          },
        ],
        sqlSnippets: [],
      },
    },
    create_time: new Date(),
    update_time: new Date(),
  },
];

export const customFunctions: CustomFunction[] = [
  {
    id: 'presetAddFunction',
    definition: '(x, y) => x + y',
    is_preset: true,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'multiplyFunction',
    definition: '(x, y) => x * y',
    is_preset: false,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'divideFunction',
    definition: '(x, y) => x / y',
    is_preset: false,
    create_time: new Date(),
    update_time: new Date(),
  },
];

export const sqlSnippets: SqlSnippet[] = [
  {
    id: 'presetSqlSnippet',
    content: 'presetSnippet',
    is_preset: true,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'SqlSnippet1',
    content: 'snippet1',
    is_preset: false,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'SqlSnippet2',
    content: 'snippet2',
    is_preset: false,
    create_time: new Date(),
    update_time: new Date(),
  },
];

export const notFoundId = '3e7acce4-b8cd-4c01-b009-d2ea33a07258';
