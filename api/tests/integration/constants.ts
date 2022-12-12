import { ROLE_TYPES } from '../../src/api_models/role';
import Account from '../../src/models/account';
import ApiKey from '../../src/models/apiKey';
import DataSource from '../../src/models/datasource';
import Dashboard from '../../src/models/dashboard';
import { parseDBUrl } from '../utils';

export const accounts: Account[] = [
  {
    id: '6ea04311-b43a-4407-badf-a71ea8c20aec',
    name: 'account1',
    email: 'account1@test.com',
    password: '', //Will be filled later
    role_id: ROLE_TYPES.INACTIVE,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'deec745c-a9af-4b6a-8322-9abbb395c0f0',
    name: 'account2',
    email: 'account2@test.com',
    password: '', //Will be filled later
    role_id: ROLE_TYPES.READER,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'df1f74ae-f608-4c0d-a41f-54f5054f9bce',
    name: 'account3',
    email: 'account3@test.com',
    password: '', //Will be filled later
    role_id: ROLE_TYPES.AUTHOR,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'dde24a37-1355-40a5-b82a-02cf72af1337',
    name: 'account4',
    email: 'account4@test.com',
    password: '', //Will be filled later
    role_id: ROLE_TYPES.ADMIN,
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '1b7a960b-24bf-4c5e-8043-6dbc146b1348',
    name: 'superadmin',
    email: 'superadmin@test.com',
    password: '', //Will be filled later
    role_id: ROLE_TYPES.SUPERADMIN,
    create_time: new Date(),
    update_time: new Date(),
  }
];

export const apiKeys: ApiKey[] = [
  {
    id: '7f6996ce-0ce8-4e6f-b95f-b093ede0585f',
    name: 'apiKey1',
    is_preset: false,
    role_id: ROLE_TYPES.INACTIVE,
    app_id: 'apiKey1_appid',
    app_secret: 'apiKey1_appsecret',
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '27d288d7-9c9a-45d7-9a93-1031f1dc0365',
    name: 'apiKey2',
    is_preset: false,
    role_id: ROLE_TYPES.READER,
    app_id: 'apiKey2_appid',
    app_secret: 'apiKey2_appsecret',
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: 'd2f2ac4d-c17d-49c8-9eb5-5b98506c33da',
    name: 'apiKey3',
    is_preset: false,
    role_id: ROLE_TYPES.AUTHOR,
    app_id: 'apiKey3_appid',
    app_secret: 'apiKey3_appsecret',
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '561b2afc-44ce-40c9-b09f-598326201310',
    name: 'apiKey4',
    is_preset: true,
    role_id: ROLE_TYPES.ADMIN,
    app_id: 'apiKey4_appid',
    app_secret: 'apiKey4_appsecret',
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '03a8b034-af52-47c5-a1d7-e7e107ddf688',
    name: 'apiKey5',
    is_preset: false,
    role_id: ROLE_TYPES.SUPERADMIN,
    app_id: 'apiKey5_appid',
    app_secret: 'apiKey5_appsecret',
    create_time: new Date(),
    update_time: new Date(),
  }
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
      host: 'http://jsonplaceholder.typicode.com'
    },
    create_time: new Date(),
    update_time: new Date(),
  }
];

export const dashboards: Dashboard[] = [
  {
    id: '63c52cf7-0783-40fb-803a-68abc6564de0',
    name: 'dashboard1',
    is_preset: false,
    is_removed: true,
    content: {
      definition: {
        queries: [
          {
            id: 'pgQuery1',
            type: 'postgresql',
            key: 'pg'
          },
          {
            id: 'httpQuery1',
            type: 'http',
            key: 'jsonplaceholder'
          }
        ]
      }
    },
    create_time: new Date(),
    update_time: new Date(),
  },
  {
    id: '173b84d2-7ed9-4d1a-a386-e68a6cce192b',
    name: 'dashboard2',
    is_preset: true,
    is_removed: false,
    content: {
      definition: {
        queries: [
          {
            id: 'pgQuery2',
            type: 'postgresql',
            key: 'pg'
          },
          {
            id: 'httpQuery2',
            type: 'http',
            key: 'jsonplaceholder'
          }
        ]
      }
    },
    create_time: new Date(),
    update_time: new Date(),
  }
];

export const notFoundId = '3e7acce4-b8cd-4c01-b009-d2ea33a07258';